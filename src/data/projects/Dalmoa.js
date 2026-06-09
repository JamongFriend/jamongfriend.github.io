export const Dalmoa = {
  id: "dalmoa",
  title: "Dalmoa",
  subtitle: "구독 통합 관리 서비스",
  period: "",   // 예: "2024.03 ~ 2024.05"
  role: "",     // 예: "백엔드 · Android 개발 / 1인 개발"
  tech: ["Java 21", "Spring Boot", "Spring Security", "JWT", "MySQL", "Kotlin", "MVVM", "Retrofit2", "OkHttp3", "Coroutines", "Docker Compose", "AWS", "Bucket4j"],
  description: "Netflix, Spotify 같은 흩어진 구독 서비스들을 한 곳에서 관리하고, 해외 결제 환율까지 자동 계산해주는 안드로이드 앱.",
  fullDescription: "Dalmoa는 OTT, 음악, 게임 등 6개 카테고리의 구독 서비스를 통합 관리하는 Android 네이티브 앱입니다. 외부 환율 API를 12시간 주기로 DB에 선제 갱신하여 USD 구독료를 원화로 자동 환산하고 월 총 지출을 계산합니다. Backend는 Java 21 + Spring Boot 3 기반의 Clean Architecture(4계층)로 설계했으며, Android는 MVVM 패턴과 Kotlin Coroutines로 비동기 처리를 구현했습니다. Docker Compose와 AWS(Nginx 리버스 프록시) 기반으로 배포 자동화를 완성한 풀스택 프로젝트입니다.",
  features: [
    {
      title: "실시간 환율 연동 엔진",
      desc: "외부 환율 API를 연동하여 USD 구독료를 KRW로 즉시 환산하는 통화 변환 로직을 구현했습니다. @Scheduled로 앱 시작 시 및 12시간마다 환율을 DB에 선제 갱신하고, 클라이언트 요청 시 DB에서 조회하는 구조로 외부 API 반복 호출을 제거했습니다."
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
      title: "Rate Limiting — 브루트포스 공격 방어",
      desc: "Bucket4j 라이브러리를 활용한 IP 기반 요청 속도 제한을 구현했습니다. 로그인·회원가입 엔드포인트에 한해 IP당 분당 10회 초과 요청 시 429(Too Many Requests)를 반환하는 OncePerRequestFilter를 적용하여 자격증명 무차별 대입(Brute-force) 공격을 방어했습니다."
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
      title: "타인 데이터 접근 취약점(IDOR) 차단",
      problem: "URL 경로 변수(userId 등)를 조작해 다른 사용자의 데이터에 접근 가능한 취약점 존재",
      cause: "요청자 검증을 Path Variable 기반으로 처리하여 클라이언트 측 값 변조 시 인가 우회 가능",
      solution: "URL 경로 변수 제거 후 Security Context / JWT 기반 인가 로직 재설계하여 취약점 원천 차단"
    },
    {
      title: "Docker 기반 MySQL 연동 장애",
      problem: "Docker Compose 실행 시 애플리케이션 컨테이너가 DB 연결 실패로 기동 불가",
      cause: "컨테이너 초기화 순서 불일치로 DB 준비 전 앱이 연결을 시도하고, 브릿지 네트워크 설정 누락으로 컨테이너 간 통신 실패",
      solution: "depends_on + healthcheck 설정으로 초기화 순서 보장, 네트워크 브릿지 및 볼륨 마운트 구성으로 안정화"
    }
  ],
  flow: "/flows/DalmoaFlow.md",
  github: "https://github.com/JamongFriend/Dalmoa"
};
