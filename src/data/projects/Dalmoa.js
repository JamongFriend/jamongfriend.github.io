export const Dalmoa = {
  id: "dalmoa",
  title: "Dalmoa",
  subtitle: "구독 통합 관리 서비스",
  tech: ["Java 21", "Spring Boot", "Spring Security", "JWT", "MySQL", "Kotlin", "MVVM", "Retrofit2", "OkHttp3", "Coroutines", "Docker Compose", "AWS", "Spring Cache"],
  description: "Netflix, Spotify 같은 흩어진 구독 서비스들을 한 곳에서 관리하고, 해외 결제 환율까지 자동 계산해주는 안드로이드 앱.",
  fullDescription: "Dalmoa는 OTT, 음악, 게임 등 6개 카테고리의 구독 서비스를 통합 관리하는 Android 네이티브 앱입니다. 실시간 환율 API 연동으로 USD 구독료를 자동 원화 환산하고 월 총 지출을 계산합니다. Backend는 Java 21 + Spring Boot 3 기반의 Clean Architecture(4계층)로 설계했으며, Android는 MVVM 패턴과 Kotlin Coroutines로 비동기 처리를 구현했습니다. Docker Compose와 AWS(Nginx 리버스 프록시) 기반으로 배포 자동화를 완성한 풀스택 프로젝트입니다.",
  features: [
    {
      title: "실시간 환율 연동 엔진",
      desc: "외부 환율 API를 연동하여 USD 구독료를 KRW로 즉시 환산하는 통화 변환 로직을 구현했습니다. Spring Cache(@Cacheable)를 적용하여 반복 API 호출을 캐싱함으로써 응답 속도를 개선하고 네트워크 오버헤드를 최소화했습니다."
    },
    {
      title: "대시보드 & 통계 API",
      desc: "Java Stream API를 활용하여 카테고리별 지출 합산 및 월간 통계 로직을 서버 단에서 처리했습니다. 클라이언트에 정제된 데이터를 전달하여 데이터 정합성을 확보하고 Android 측 연산 부담을 줄였습니다."
    },
    {
      title: "스케줄링 기반 알림 시스템",
      desc: "Spring Task Scheduler를 활용하여 매일 오전 9시에 구독 결제일이 도래한 사용자에게 맞춤형 푸시 알림을 발송하는 로직을 구현했습니다."
    },
    {
      title: "안정적인 회원 인증 체계",
      desc: "Spring Security와 JWT를 연동한 무상태(Stateless) 인증 아키텍처를 설계했습니다. Access/Refresh Token 이중 구조와 TokenAuthenticator를 통해 401 응답 시 무중단 자동 재인증을 구현했으며, Android Keystore로 토큰을 안전하게 저장했습니다."
    },
    {
      title: "인프라 및 배포 자동화",
      desc: "Docker Compose V2를 활용한 컨테이너 오케스트레이션과 Multi-stage Build로 이미지 경량화를 구현했습니다. AWS 환경에서 Nginx 리버스 프록시를 구성하고 HTTPS/SSL 인증서를 적용하여 안드로이드 보안 정책을 만족하는 인프라를 구축했습니다."
    }
  ],
  troubleshooting: [
    {
      title: "인프라 가용성 확보 — AWS EBS 볼륨 확장",
      content: "현상: 배포 중 디스크 용량 부족으로 컨테이너 실행 실패. 해결: AWS EBS 볼륨 확장 및 파티션 최적화를 통해 안정적인 가동 환경 구축."
    },
    {
      title: "API 권한 강화 — IDOR 취약점 원천 차단",
      content: "현상: URL 경로 변수(userId)를 통해 타인의 구독 데이터에 접근 가능한 보안 취약점(IDOR) 발견. 해결: URL 경로 변수를 제거하고 Security Context/JWT에서 사용자 정보를 추출하도록 로직 개선."
    },
    {
      title: "DB 커넥션 관리 — Docker 네트워크 충돌",
      content: "현상: Docker 기반 MySQL 연동 시 컨테이너 초기화 타이밍 문제로 네트워크 충돌 발생. 해결: 볼륨 마운트 및 네트워크 브릿지 설정으로 컨테이너 간 의존성 관리 및 안정화."
    },
    {
      title: "환경 일관성 유지 — 로컬-서버 배포 표준화",
      content: "현상: 빌드 환경(JDK 21) 및 Docker Compose 버전 호환성 이슈로 로컬 빌드 성공 후 서버 배포 실패. 해결: Docker Multi-stage Build로 빌드 환경을 컨테이너 내에 고정하여 환경 차이를 제거."
    },
    {
      title: "사용자 경험 개선 — Kotlin Coroutines & Null-safety",
      content: "현상: 비동기 API 호출 중 UI 스레드 블로킹 및 Null 참조로 인한 런타임 크래시 발생. 해결: Kotlin Coroutines 기반 비동기 처리와 ViewBinding을 통한 Null-safety 확보로 런타임 안정성 및 UX 개선."
    }
  ],
  github: "https://github.com/JamongFriend/Dalmoa"
};
