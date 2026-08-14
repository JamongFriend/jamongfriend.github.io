export const Chatzar = {
  id: "chatzar",
  title: "Chatzar",
  subtitle: "실시간 랜덤 채팅 플랫폼",
  tech: ["Java", "Spring Boot", "STOMP", "MySQL", "Spring Security", "JPA", "JUnit5", "Kotlin", "Android Studio"],
  description: "랜덤 매칭을 통한 실시간 채팅 서비스. 친구 관계 미등록 시 채팅방 잠금 등 비즈니스 로직을 포함한 안드로이드 애플리케이션",
  fullDescription: "Chatzar는 보안성과 실시간성을 극대화한 채팅 서비스의 백엔드 시스템입니다. 닉네임#태그 시스템을 통한 고유 식별 체계를 구축하였으며, WebSocket 기반의 양방향 통신 환경에서 발생할 수 있는 보안 충돌 및 비동기 경주 상태(Race Condition) 문제를 해결하며 안정적인 인프라를 구축하는 데 집중했습니다.",
  features: [
    {
      title: "실시간 메시징 및 가용성 확보",
      desc: "WebSocket과 STOMP 프로토콜을 활용하여 전이중(Full-duplex) 통신 환경을 구축했습니다. 메시지 브로커를 통해 수만 명의 동시 접속자를 처리할 수 있는 인프라를 설계하였으며, ChannelInterceptor를 사용하여 연결 세션별 실시간 인증 및 권한 검증 로직을 구현했습니다.",
      image: "/images/Chatzar/Chatzar_chatting.png"
    },
    {
      title: "고유 식별 시스템 (Discord Style)",
      desc: "사용자가 인식하는 닉네임과 시스템이 식별하는 고유 ID를 분리했습니다. 닉네임 중복을 허용하되 4자리 랜덤 태그를 부여하여 사용자를 고유하게 식별하며, 이를 통해 사용자 탐색의 편의성과 보안성을 동시에 확보했습니다.",
      images: ["/images/Chatzar/Chatzar_friend_list.png", "/images/Chatzar/Chatzar_profile.png"]
    },
    {
      title: "전략적 매칭 및 관계 기반 Chat Lock",
      desc: "사용자의 선호도(성별, 나이 등)를 반영한 동적 매칭 알고리즘을 구현했습니다. 랜덤으로 매칭된 상대와 계속 연락을 이어가고 싶을 수도, 그렇지 않을 수도 있다는 점에 착안하여 상호 친구 수락(ACCEPTED) 상태일 때만 채팅을 지속할 수 있는 'Chat Lock' 로직을 도입했습니다. 이를 통해 사용자가 상대와의 연락 지속 여부를 직접 선택할 수 있도록 했습니다.",
      images: ["/images/Chatzar/Chatzar_matching.png", "/images/Chatzar/Chatzar_matching_detail.png", "/images/Chatzar/Chatzar_isMatching.png"]
    },
    {
      title: "관계 기반 Chat Lock",
      desc: "친구 요청을 수락하면 대화를 계속 이어갈 수 있고, 거절하거나 응답하지 않으면 더 이상 메시지를 주고받을 수 없도록 제한하여, 랜덤 매칭 이후 관계 지속 여부에 대한 선택권을 사용자에게 제공합니다.",
      images: ["/images/Chatzar/Chatzar_isNotFriend.png", "/images/Chatzar/Chatzar_friend_request.png"]
    }
  ],
  troubleshooting: [
    {
      title: "보안 사각지대 해소",
      problem: "WebSocket 연결 시 서버가 403을 반환하며 핸드쉐이크 자체가 실패",
      cause: "Spring Security의 JwtAuthFilter가 HTTP 레벨에서 /ws/** 업그레이드 요청을 가로채 JWT 검증을 수행, 일반 HTTP와 동일한 방식으로 처리하여 차단",
      solution: "SecurityConfig에서 /ws/** 경로를 HTTP 필터 대상에서 제외하고, STOMP CONNECT 명령 수신 시점에 StompAuthInterceptor가 Authorization 헤더를 검증하는 이중 검증 레이어로 변경"
    },
    {
      title: "WebSocket 연결 완료 전 구독 시도로 인한 크래시",
      problem: "채팅방 진입 시 간헐적으로 앱이 크래시하며 메시지 수신 불가",
      cause: "StompClient.connect() 호출 직후 토픽 구독을 시도하여, 연결이 완료되지 않은 상태에서 구독 명령이 실행",
      solution: "lifecycle() 이벤트를 먼저 구독하고 OPENED 콜백 내에서만 토픽 구독을 실행하는 지연 구독(Lazy Subscription) 패턴 적용"
    }
  ],
  flow: "/flows/ChatzarFlow.md",
  github: "https://github.com/JamongFriend/Chatzar"
};
