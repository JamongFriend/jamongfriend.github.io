# Dalmoa 서비스 흐름

> **구독 서비스 관리 앱** — Android (Kotlin/MVVM) + Spring Boot Backend

---

## 1. 시스템 구성도

```mermaid
graph TB
    subgraph Android["📱 Android App"]
        Fragment["Fragment (View)"]
        VM["ViewModel + UiState"]
        Repo["Repository"]
        Interceptor["AuthInterceptor\n(헤더 자동 주입)"]
        Authenticator["TokenAuthenticator\n(자동 토큰 재발급)"]
        TokenMgr["TokenManager\n(SharedPreferences)"]

        Fragment <--> VM
        VM <--> Repo
        Repo --> Interceptor
        Interceptor --> Authenticator
        Authenticator <--> TokenMgr
    end

    subgraph Backend["⚙️ Spring Boot Backend (dalmoa.duckdns.org)"]
        RateLimit["RateLimitFilter\n(Bucket4j, IP당 분당 10회)"]
        JwtFilter["JwtAuthFilter\n(토큰 검증)"]

        subgraph Controllers["Controllers"]
            AuthCtrl["AuthController\n/api/auth"]
            MemberCtrl["MemberController\n/api/member"]
            SubCtrl["SubscribeController\n/api/subscribe"]
            NotiCtrl["NotificationController\n/api/notifications"]
            ExCtrl["ExchangeRateController\n/api/exchange-rates"]
        end

        subgraph Services["Services"]
            AuthSvc["AuthService"]
            MemberSvc["MemberService"]
            SubSvc["SubscribeService"]
            NotiSvc["NotificationService"]
            CalcSvc["CalculationService\n(@Cacheable 환율 캐싱)"]
            ExSvc["ExchangeRateService"]
        end

        subgraph Scheduler["⏰ Scheduler"]
            NotiSch["NotificationScheduler\n매일 09:00"]
            ExSch["ExchangeRateScheduler\n주기적 환율 갱신"]
        end

        DB[("🗄️ Database")]

        RateLimit --> JwtFilter
        JwtFilter --> Controllers
        Controllers --> Services
        Services --> DB
        Scheduler --> Services
    end

    ExternalAPI["🌐 ExchangeRate API\n(외부 환율 서비스)"]

    Android -- "HTTPS 요청" --> Backend
    CalcSvc -- "환율 조회" --> ExternalAPI
    ExSvc -- "환율 갱신" --> ExternalAPI
```

---

## 2. 인증 흐름

### 2-1. 회원가입 / 로그인

```mermaid
sequenceDiagram
    participant App as Android App
    participant Rate as RateLimitFilter
    participant Auth as AuthController
    participant Svc as AuthService
    participant DB as Database

    Note over App,DB: 회원가입
    App->>Auth: POST /api/member/signUp
    Auth->>Svc: SignUp(request)
    Svc->>Svc: BCrypt 비밀번호 해싱
    Svc->>DB: Member 저장
    DB-->>App: SignUpResponse

    Note over App,DB: 로그인
    App->>Rate: POST /api/auth/login
    Rate->>Rate: IP당 분당 10회 제한 확인
    Rate->>Auth: 통과
    Auth->>Svc: login(request)
    Svc->>DB: 이메일로 회원 조회
    Svc->>Svc: BCrypt 비밀번호 검증
    Svc->>Svc: AccessToken + RefreshToken 발급
    Note right of Svc: rememberMe=true → 장기 만료<br/>rememberMe=false → 1일 만료
    Svc->>DB: RefreshToken 저장
    DB-->>App: TokenResponse (accessToken, refreshToken)
    App->>App: TokenManager에 토큰 저장
```

### 2-2. 토큰 만료 시 자동 재발급

```mermaid
sequenceDiagram
    participant App as Android App
    participant Interceptor as AuthInterceptor
    participant Server as Backend
    participant Authenticator as TokenAuthenticator
    participant AuthAPI as /api/auth/reissue

    App->>Interceptor: API 요청
    Interceptor->>Interceptor: Authorization: Bearer {AccessToken} 헤더 추가
    Interceptor->>Server: 요청 전달
    Server-->>Interceptor: 401 Unauthorized (토큰 만료)
    Interceptor->>Authenticator: authenticate() 호출

    Note over Authenticator: synchronized 블록으로 중복 재발급 방지
    Authenticator->>Authenticator: 현재 저장 토큰 vs 요청에 쓴 토큰 비교
    alt 이미 다른 스레드에서 갱신됨
        Authenticator-->>App: 새 토큰으로 요청 재시도
    else 직접 갱신 필요
        Authenticator->>AuthAPI: POST /api/auth/reissue (별도 Retrofit 인스턴스)
        AuthAPI->>AuthAPI: RefreshToken 유효성 + DB 일치 여부 검증
        AuthAPI->>AuthAPI: 새 AccessToken + RefreshToken 발급 (토큰 로테이션)
        AuthAPI-->>Authenticator: 새 TokenResponse
        Authenticator->>Authenticator: TokenManager에 새 토큰 저장
        Authenticator-->>App: 원래 요청 재시도
    end
```

---

## 3. 인증된 요청 공통 흐름

```mermaid
flowchart LR
    A["Android 요청"] --> B["AuthInterceptor\nBearer 토큰 자동 추가"]
    B --> C{"RateLimitFilter\n로그인/회원가입만"}
    C -- 제한 초과 --> D["429 Too Many Requests"]
    C -- 통과 --> E["JwtAuthFilter"]
    E --> F{"토큰 유효?"}
    F -- 유효 --> G["SecurityContext에\nmemberId 주입"]
    F -- 무효 --> H["401 Unauthorized"]
    G --> I["Controller\n@AuthenticationPrincipal\nLong memberId"]
```

---

## 4. 구독 관리 흐름

```mermaid
flowchart TD
    subgraph Android["Android (SubscribeViewModel)"]
        A1["구독 추가 화면\nSubscribeAddFragment"]
        A2["구독 목록 화면\nSubscribeListFragment"]
        A3["구독 상세/수정\nSubscribeEditFragment"]
        A4["구독 삭제"]
    end

    subgraph API["Backend API"]
        B1["POST /api/subscribe/{memberId}"]
        B2["GET /api/subscribe/list/{memberId}"]
        B3["PUT /api/subscribe/{subscribeId}"]
        B4["DELETE /api/subscribe/{subscribeId}/{memberId}"]
    end

    subgraph Logic["SubscribeService 도메인 규칙"]
        C1["currency == null → KRW 기본값 적용"]
        C2["subCategory == ETC → customCategoryTag 저장\n그 외 → customCategoryTag = null"]
        C3["소유자(memberId) 검증 후 삭제"]
    end

    A1 --> B1 --> C1 & C2
    A2 --> B2
    A3 --> B3 --> C1 & C2
    A4 --> B4 --> C3
```

---

## 5. 대시보드 / 통계 흐름

```mermaid
flowchart TD
    App["Android\nSubscribeStatsFragment\n(PieChartView 커스텀 뷰)"]

    App -->|"GET /api/subscribe/dashboard/{memberId}"| Ctrl["SubscribeController"]
    Ctrl --> SubSvc["SubscribeService\n회원의 전체 구독 조회"]

    SubSvc --> CalcSvc["CalculationService"]

    CalcSvc --> Total["totalAmount()\n전체 합산"]
    CalcSvc --> Group["calculateGroupedAmount()\n카테고리별 합산"]

    Total --> Convert["convertToKrw()"]
    Group --> Convert

    Convert --> Check{"통화?"}
    Check -- KRW --> Direct["그대로 반환"]
    Check -- USD --> Cache{"@Cacheable\n캐시 확인"}
    Cache -- HIT --> CacheReturn["캐시에서 환율 반환"]
    Cache -- MISS --> ExtAPI["ExchangeRate API 호출\n→ 캐시 저장"]

    Direct & CacheReturn & ExtAPI --> Response["DashboardResponse\n{ total: 전체 KRW 환산액,\n  categorySums: {OTT, MUSIC, GAME ...} }"]

    Response --> App
```

---

## 6. 알림 스케줄러 흐름

```mermaid
sequenceDiagram
    participant Sch as NotificationScheduler
    participant Svc as NotificationService
    participant DB as Database
    participant App as Android App

    Note over Sch: 매일 오전 09:00 (Cron)

    Sch->>Svc: checkAndSendNotifications()

    Svc->>DB: 오늘+7일이 결제일인 구독 조회
    DB-->>Svc: 해당 구독 목록
    loop 7일 전 대상
        Svc->>DB: "일주일 뒤에 [서비스명] 결제 예정" 알림 저장
    end

    Svc->>DB: 오늘+1일이 결제일인 구독 조회
    DB-->>Svc: 해당 구독 목록
    loop 1일 전 대상
        Svc->>DB: "내일 [서비스명] 결제 예정. 잔액 확인!" 알림 저장
    end

    Note over App: 사용자가 앱 실행 시

    App->>DB: GET /api/notifications/unread-exists
    DB-->>App: true/false (읽지 않은 알림 여부)
    App->>DB: GET /api/notifications (전체 목록, 최신순)
    App->>DB: PATCH /api/notifications/{id}/read (읽음 처리)
```

---

## 7. 환율 이중 구조

```mermaid
flowchart LR
    subgraph Realtime["실시간 계산용 (CalculationService)"]
        R1["대시보드 요청"] --> R2["@Cacheable 확인"]
        R2 -- HIT --> R3["캐시에서 즉시 반환"]
        R2 -- MISS --> R4["ExchangeRate API 호출"]
        R4 --> R5["캐시 저장 후 반환"]
    end

    subgraph Scheduled["DB 저장용 (ExchangeRateScheduler)"]
        S1["주기 스케줄러"] --> S2["USD 기준 전체 환율 조회"]
        S2 --> S3{"DB에 존재?"}
        S3 -- 있음 --> S4["rate + updatedAt UPDATE"]
        S3 -- 없음 --> S5["새 ExchangeRate INSERT"]
        S4 & S5 --> S6["GET /api/exchange-rates\n저장된 환율 목록 제공"]
    end

    ExAPI["🌐 ExchangeRate API"]
    R4 --> ExAPI
    S2 --> ExAPI
```
