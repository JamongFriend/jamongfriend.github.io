export const librarymanagement = {
  id: "librarymanagement",
  title: "Library Management System",
  subtitle: "도서 관리 백엔드 시스템",
  tech: ["Java", "Spring Boot", "JPA", "MySQL"],
  description: "객체 지향 설계를 바탕으로 한 RESTful API 서버 구축 연습. ISBN 연동 및 예약 자동화 로직 구현.",
  fullDescription: "도서 등록/대여/반납/예약 전 과정을 관리하는 백엔드 시스템입니다. 도메인–리포지토리–서비스–컨트롤러의 계층 구조로 설계했고, Admin*/App* 컨트롤러를 분리해 관리자 화면과 사용자 기능을 명확히 구분했습니다. 국립중앙도서관 OpenAPI와 연동하여 ISBN으로 책 정보를 조회·자동 등록하는 기능을 제공합니다.",
  features: [
    { title: "ISBN 조회 & 자동 등록/증가", desc: "/api/v1/admin/books/lookup-isbn로 외부 OpenAPI 조회 → 기존 재고면 증가, 없으면 신규 생성 (RestTemplate + ObjectMapper)" },
    { title: "대여/반납", desc: "대여 생성, 반납 처리 시 재고 복원 및 다음 예약자 자동 배정" },
    { title: "예약 우선 처리", desc: "같은 도서에 대해 가장 빠른 예약자(earliest by reservationDate)에게 자동 대여 할당" },
    { title: "재고 동시성 제어", desc: "재고 변경 시 PESSIMISTIC_WRITE 사용으로 동시 수정 안전성 확보" }
  ],
  troubleshooting: [
    { title: "중복 대여 생성", content: "원인: 동일 회원/도서에 활성 대여 존재 여부 체크 누락. 해결: RentalRepository.existsActiveByMemberAndBook 선검증, 서비스 레벨 가드 추가. 성과: 동일 도서 중복 대여 100% 차단" },
    { title: "ISBN 입력 포맷 다양", content: "원인: 외부 API/내부 DB에서 포맷 불일치. 해결: normalizeIsbn()로 하이픈 제거·길이 검증, 10→13 변환 처리, 유효성 예외 공통화. 성과: ISBN 조회 성공률 향상, 운영 입력 실수 감소" }
  ],
  github: "https://github.com/JamongFriend/libraryManagement"
};
