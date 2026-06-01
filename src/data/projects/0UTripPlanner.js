export const oUTripPlanner = {
  id: "outripplanner",
  title: "0U Trip Planner",
  subtitle: "Full-stack 여행 플랫폼",
  tech: ["Node.js", "Express", "MySQL", "React.js", "Kakao Maps API", "Passport.js"],
  description: "여행 계획을 생성하고 공유할 수 있는 웹 플랫폼. Kakao Map API를 연동한 실시간 장소 검색 및 시각화.",
  fullDescription: "0U Trip Planner는 나만의 여행 일정을 상세히 기록하고, 타인과 공유하며 소통할 수 있는 풀스택 웹 서비스입니다. 단순한 정보 기록을 넘어 공유(Share) 및 가져오기(Import) 로직을 통해 사용자 간 인터랙션을 극대화했으며, Kakao Map API를 깊이 있게 커스터마이징하여 실시간 장소 검색 및 시각화 기능을 구현했습니다.",
  mainImage: "/images/0UTripPlanner/main_screen.png",
  features: [
    {
      title: "플래너 공유 게시판 & 소셜 기능",
      desc: "isShared 플래그 토글 하나로 내 플래너를 공개 게시판에 등록하거나 비공개로 전환하는 상태 제어 로직을 구현했습니다. 게시판에서는 좋아요(likes 컬럼 증감)와 북마크(isMarked 상태 관리)를 지원하며, 마음에 드는 타인의 플래너를 '가져오기(Import)'하면 Plan과 연관된 DayPlace 데이터를 새 사용자 소유로 Deep Copy하여 독립적으로 편집할 수 있도록 설계했습니다.",
      images: ["/images/0UTripPlanner/plan_list.png", "/images/0UTripPlanner/plan_share.png", "/images/0UTripPlanner/plan_create.png", "/images/0UTripPlanner/plan_detail.png"]
    },
    {
      title: "세션 기반 로컬 로그인 & 카카오 OAuth 2.0",
      desc: "Passport.js의 Local Strategy로 이메일/비밀번호 인증을 구현했습니다. 비밀번호는 bcrypt로 해싱하여 저장하고, 로그인 성공 시 express-session이 서버 측 세션을 생성하여 쿠키로 클라이언트에 전달합니다. 추가로 KakaoStrategy를 연동하여 OAuth 2.0 인가 코드 방식의 소셜 로그인을 구현했으며, 신규 카카오 사용자는 자동으로 DB에 등록됩니다. isLoggedIn / isNotLoggedIn 커스텀 미들웨어를 라우터 레벨에 적용해 인증 접근 제어를 일관성 있게 처리했습니다.",
      image: "/images/0UTripPlanner/login.png"
    },
    {
      title: "Kakao Maps API 커스텀 인터랙션",
      desc: "단순 지도 표시에서 나아가, 키워드 검색 시 Places 서비스를 연동하여 연관 검색어 리스트를 동적으로 생성했습니다. 선택한 장소로의 부드러운 시점 이동(panTo)과 여러 좌표를 한 화면에 담는 LatLngBounds를 활용해 UX를 최적화했습니다.",
      image: "/images/0UTripPlanner/map_interaction.png"
    },
    {
      title: "공유 게시판 키워드 검색",
      desc: "공유 게시판에서 플래너 제목과 여행지를 대상으로 키워드 검색 기능을 구현했습니다. Express 라우터에서 쿼리 파라미터를 수신하고 Sequelize의 Op.like 연산자로 MySQL LIKE 쿼리를 생성하여 부분 일치 검색을 지원합니다. 검색어가 없을 경우 전체 공개 플래너를 반환하는 분기 처리로 하나의 API 엔드포인트에서 목록 조회와 검색을 모두 처리했습니다."
    },
    {
      title: "관계형 데이터베이스 설계 및 최적화",
      desc: "MySQL 환경에서 User와 Plan 테이블 간의 1:N 관계를 설정하고, Sequelize의 Eager Loading(Include)을 활용하여 쿼리 횟수를 줄이면서도 작성자 정보를 효율적으로 결합했습니다. 이를 통해 공유 게시판에서 각 플래너의 소유주 정보를 실시간으로 렌더링합니다."
    }
  ],
  troubleshooting: [
    {
      title: "Sequelize Eager Loading을 통한 N+1 문제 해결",
      problem: "여행 일정 조회 시 연관 DayPlace 개수만큼 추가 SELECT 쿼리 발생으로 API 응답 시간 저하",
      cause: "ORM 기본 Lazy Loading으로 메인 데이터 조회 후 연관 데이터를 개별 호출하는 비효율적 쿼리 구조",
      solution: "include 옵션(Eager Loading)으로 JOIN 단일 쿼리로 개선하여 응답 시간 단축"
    },
    {
      title: "CORS + 세션 쿠키 미전송 문제",
      problem: "React(3000포트)에서 Express(8002포트)로 로그인 후 /auth/status 재요청 시 항상 미인증 상태 반환",
      cause: "크로스 오리진 환경에서 Axios 기본값(withCredentials: false)으로 세션 쿠키 미전송",
      solution: "cors({ credentials: true, origin: 'http://localhost:3000' }), 세션 쿠키 sameSite: 'lax' 서버 설정과 클라이언트 withCredentials: true 적용으로 세션 정상 유지"
    }
  ],
  flow: "/flows/0UTipPlannerFlow.md",
  github: "https://github.com/JamongFriend/0UTripPlanner"
};
