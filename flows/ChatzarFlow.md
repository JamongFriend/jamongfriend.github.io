# Chatzar - 서비스 흐름 & 아키텍처

> 랜덤 매칭 기반 익명 채팅 Android 앱

---

## 1. 전체 아키텍처

```mermaid
graph TB
    subgraph Presentation["Presentation Layer"]
        F1[LoginFragment]
        F2[SignupFragment]
        F3[MatchStartFragment]
        F4[MatchProcessFragment]
        F5[ChatDetailFragment]
        F6[ChatListFragment]
        F7[FriendListFragment]
        F8[MyPageFragment]
    end

    subgraph ViewModel["ViewModel Layer"]
        VM1[LoginViewModel]
        VM2[SignupViewModel]
        VM3[MatchViewModel]
        VM4[MatchPreferenceViewModel]
        VM5[ChatDetailViewModel]
        VM6[ChatListViewModel]
        VM7[FriendViewModel]
        VM8[MyPageViewModel]
    end

    subgraph Repository["Repository Layer"]
        R1[AuthRepository]
        R2[MatchRepository]
        R3[ChatRepository]
        R4[MessageRepository]
        R5[FriendshipRepository]
        R6[MemberRepository]
    end

    subgraph Core["Core"]
        direction LR
        NET[ApiClient\nRetrofit + OkHttp]
        AUTH[AuthInterceptor]
        TOKEN[TokenManager\nSharedPreferences]
        WS[STOMP WebSocket]
    end

    subgraph Remote["Remote API"]
        API1[AuthApi]
        API2[MatchApi]
        API3[ChatApi]
        API4[MessageApi]
        API5[FriendshipApi]
        API6[MemberApi]
    end

    subgraph Server["Spring Boot Server"]
        REST[REST API\n:8080]
        WSRV[WebSocket\n/ws]
    end

    Presentation --> ViewModel
    ViewModel --> Repository
    Repository --> Remote
    Remote --> Core
    Core --> Server
    WS --> WSRV
```

---

## 2. 클린 아키텍처 레이어 구조

```mermaid
graph LR
    subgraph UI["UI (Fragment)"]
        direction TB
        U1[View 렌더링]
        U2[사용자 이벤트 수집]
        U3[StateFlow 구독]
    end

    subgraph VM["ViewModel"]
        direction TB
        V1[UiState 관리\nMutableStateFlow]
        V2[비즈니스 로직]
        V3[viewModelScope\nCoroutine]
    end

    subgraph Repo["Repository"]
        direction TB
        RE1[데이터 소스 추상화]
        RE2[API 호출 위임]
    end

    subgraph Data["Data Source"]
        direction TB
        D1[Retrofit API Interface]
        D2[DTO 매핑]
    end

    UI -- "함수 호출" --> VM
    VM -- "StateFlow emit" --> UI
    VM -- "suspend fun" --> Repo
    Repo -- "Response<T>" --> VM
    Repo -- "HTTP 요청" --> Data
    Data -- "JSON 응답" --> Repo
```

---

## 3. 인증 흐름 (Auth Flow)

```mermaid
sequenceDiagram
    actor User
    participant Fragment as LoginFragment
    participant VM as LoginViewModel
    participant Repo as AuthRepository
    participant API as AuthApi (Retrofit)
    participant Server as Spring Server
    participant Token as TokenManager

    User->>Fragment: 로그인 버튼 클릭
    Fragment->>VM: login(email, password)
    VM->>VM: UiState = Loading
    VM->>Repo: login(LoginRequest)
    Repo->>API: POST /api/v1/auth/login
    API->>Server: HTTP Request
    Server-->>API: 200 OK { accessToken, ... }
    API-->>Repo: Response<LoginResponse>
    Repo-->>VM: Response<LoginResponse>
    VM->>Token: saveToken(accessToken)
    VM->>VM: UiState = Success
    VM-->>Fragment: StateFlow 업데이트
    Fragment->>Fragment: MainActivity로 이동
```

---

## 4. 매칭 흐름 (Match Flow)

```mermaid
sequenceDiagram
    actor User
    participant Fragment as MatchProcessFragment
    participant VM as MatchViewModel
    participant Repo as MatchRepository
    participant Server as Spring Server

    User->>Fragment: 매칭 시작 버튼
    Fragment->>VM: requestMatch()
    VM->>VM: UiState = Requesting
    VM->>Repo: requestMatch()
    Repo->>Server: POST /api/v1/match/request

    alt 즉시 매칭 성공
        Server-->>Repo: { matched: true, chatRoomId: 1, partnerNickname: "..." }
        Repo-->>VM: Response (matched=true)
        VM->>VM: UiState = Matched(chatRoomId)
        VM-->>Fragment: StateFlow 업데이트
        Fragment->>Fragment: ChatDetailFragment로 이동
    else 대기 상태 (폴링 시작)
        Server-->>Repo: { matched: false }
        Repo-->>VM: Response (matched=false)
        VM->>VM: UiState = Waiting
        loop 3초마다 폴링
            VM->>Repo: getMatchStatus()
            Repo->>Server: GET /api/v1/match/status
            Server-->>Repo: { matched: false }
        end
        Server-->>Repo: { matched: true, chatRoomId: 5 }
        VM->>VM: UiState = Matched(chatRoomId)
        VM-->>Fragment: StateFlow 업데이트
        Fragment->>Fragment: ChatDetailFragment로 이동
    end

    opt 사용자가 취소
        User->>Fragment: 취소 버튼
        Fragment->>VM: cancelMatch()
        VM->>VM: pollingJob.cancel()
        VM->>Repo: cancelMatch()
        Repo->>Server: DELETE /api/v1/match/cancel
        VM->>VM: UiState = Canceled
    end
```

---

## 5. 실시간 채팅 흐름 (WebSocket / STOMP)

```mermaid
sequenceDiagram
    participant Fragment as ChatDetailFragment
    participant VM as ChatDetailViewModel
    participant MRepo as MessageRepository
    participant STOMP as STOMP Client
    participant Server as Spring WebSocket

    Fragment->>VM: connectAndSubscribe(roomId, wsUrl)
    VM->>MRepo: connectStomp(wsUrl, token)
    MRepo->>STOMP: Stomp.over(OkHttp, "ws://.../ws")
    STOMP->>Server: WebSocket Handshake
    Server-->>STOMP: Connection OPENED

    STOMP-->>VM: LifecycleEvent.OPENED
    VM->>STOMP: topic("/sub/rooms/{roomId}") 구독
    Note over VM,STOMP: 실시간 메시지 수신 대기

    Fragment->>VM: getMessages(roomId)
    VM->>Server: GET /api/v1/messages/{roomId}
    Server-->>VM: List<MessageResponse> (이전 메시지)
    VM->>VM: UiState = HistorySuccess
    VM-->>Fragment: 이전 메시지 표시

    loop 메시지 송수신
        Fragment->>VM: sendMessage(roomId, content)
        VM->>STOMP: send("/pub/chat", SocketMessage)
        STOMP->>Server: STOMP SEND frame
        Server-->>STOMP: STOMP MESSAGE (/sub/rooms/{roomId})
        STOMP-->>VM: stompMessage payload
        VM->>VM: UiState = NewMessage(MessageResponse)
        VM-->>Fragment: 새 메시지 표시
    end

    Fragment->>VM: onDestroyView()
    VM->>MRepo: disconnectStomp()
    MRepo->>STOMP: disconnect()
```

---

## 6. 친구 신청 흐름 (Friendship Flow)

```mermaid
sequenceDiagram
    actor User
    participant CDF as ChatDetailFragment
    participant FRF as FriendRequestsFragment
    participant VM1 as ChatDetailViewModel
    participant VM2 as FriendRequestsViewModel
    participant Repo as FriendshipRepository
    participant Server as Spring Server

    Note over User,Server: 채팅 중 상대방에게 친구 신청
    User->>CDF: 친구 신청 버튼
    CDF->>VM1: sendFriendRequest(targetId)
    VM1->>Repo: sendFriendRequest(targetId)
    Repo->>Server: POST /api/v1/friends/request/{targetId}
    Server-->>Repo: 200 OK
    VM1->>VM1: UiState = FriendRequestSuccess
    VM1-->>CDF: 신청 완료 토스트

    Note over User,Server: 상대방 친구 신청 수락
    User->>FRF: 친구 요청 화면 진입
    FRF->>VM2: loadPendingRequests()
    VM2->>Repo: getPendingRequests()
    Repo->>Server: GET /api/v1/friends/pending
    Server-->>Repo: List<FriendshipResponse>
    VM2-->>FRF: 대기 중인 요청 목록 표시

    User->>FRF: 수락 버튼
    FRF->>VM2: acceptRequest(friendshipId)
    VM2->>Repo: acceptFriendRequest(friendshipId)
    Repo->>Server: POST /api/v1/friends/accept/{friendshipId}
    Server-->>Repo: 200 OK
    VM2-->>FRF: 친구 목록 갱신
```

---

## 7. 네트워크 인증 처리 (Token Interceptor)

```mermaid
flowchart TD
    A[API 요청 발생] --> B[AuthInterceptor.intercept]
    B --> C{TokenManager에서\naccessToken 조회}
    C -- 토큰 있음 --> D[Authorization: Bearer token\n헤더 추가]
    C -- 토큰 없음 --> E[헤더 없이 그대로 전송]
    D --> F[서버로 요청 전송]
    E --> F
    F --> G{응답 코드}
    G -- 200 OK --> H[정상 응답 반환]
    G -- 401 Unauthorized --> I[로그인 화면으로 이동]
```
