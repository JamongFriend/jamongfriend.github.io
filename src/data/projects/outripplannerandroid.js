export const outripplannerandroid = {
  id: "outripplannerandroid",
  title: "0U Trip Planner (Android Ver.)",
  subtitle: "안드로이드 여행 앱",
  tech: ["Java", "Android Studio", "Retrofit", "Node.js", "REST API"],
  description: "기존 웹 프로젝트의 기능을 모바일 환경에서 사용할 수 있도록 확장한 안드로이드 앱.",
  fullDescription: "0U Trip Planner(Android)는 기존 웹 프로젝트의 기능을 모바일 환경에서 사용할 수 있도록 확장한 버전입니다. 웹 버전과 동일한 Node.js 기반 REST API를 활용하여 여행 계획 생성·수정·조회 등 핵심 기능을 그대로 제공하며, 모바일 UI/UX에 맞춘 화면 구성과 HTTP 통신 구조를 추가 구현하였습니다.",
  features: [
    { title: "회원가입 및 로그인", desc: "이메일·비밀번호 기반 인증 → 세션 또는 토큰을 통한 지속적 로그인 유지" },
    { title: "여행 계획 조회·상세 화면", desc: "백엔드 Trip API 연동 → 사용자 일정 목록/상세/필터링 제공" },
    { title: "여행 계획 CRUD", desc: "생성, 수정, 삭제 API 호출을 통한 실시간 일정 관리" },
    { title: "HTTP 통신", desc: "Retrofit 기반 REST API 요청/응답 처리" }
  ],
  troubleshooting: [
    { title: "CORS / 네트워크 차단 이슈", content: "모바일 WebView 요구사항 불일치 → 백엔드에서 CORS 설정 강화로 해결" },
    { title: "Retrofit 네트워크 실패", content: "비동기 콜백 누락 문제 발견 → 공통 Response Wrapper 적용해 안정화" },
    { title: "로그인 유지 장애", content: "SharedPreferences 저장 시점 누락 → 로그인 성공 즉시 값 저장하도록 구조 변경" }
  ],
  github: "https://github.com/JamongFriend/0UTripPlannerAndroid"
};
