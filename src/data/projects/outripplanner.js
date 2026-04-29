export const outripplanner = {
  id: "outripplanner",
  title: "0U Trip Planner",
  subtitle: "Full-stack 여행 플랫폼",
  tech: ["Node.js", "Express", "MySQL", "React.js", "Kakao Maps API", "Passport.js"],
  description: "여행 계획을 생성하고 공유할 수 있는 웹 및 모바일 플랫폼. Kakao Map API를 연동한 실시간 장소 검색 및 시각화.",
  fullDescription: "0U Trip Planner는 나만의 여행 일정을 상세히 기록하고, 타인과 공유하며 소통할 수 있는 풀스택 웹 서비스입니다. 단순한 정보 기록을 넘어 공유(Share) 및 가져오기(Import) 로직을 통해 사용자 간 인터랙션을 극대화했으며, Kakao Map API를 깊이 있게 커스터마이징하여 실시간 장소 검색 및 시각화 기능을 구현했습니다.",
  mainImage: "/images/0UTripPlanner/main_screen.png",
  features: [
    {
      title: "전략적 플래너 관리 및 상태 제어",
      desc: "단순 CRUD를 넘어 isMarked(즐겨찾기), isShared(공유 여부) 등의 상태 값을 활용하여 사용자 맞춤형 데이터 필터링을 구현했습니다. 특히 공유된 플래너를 내 보관함으로 복제하는 'Import' 로직을 통해 데이터 재사용성을 높였습니다.",
      images: ["/images/0UTripPlanner/plan_create.png", "/images/0UTripPlanner/plan_list.png", "/images/0UTripPlanner/plan_detail.png"]
    },
    {
      title: "Kakao Maps API 커스텀 인터랙션",
      desc: "단순 지도 표시에서 나아가, 키워드 검색 시 Places 서비스를 연동하여 연관 검색어 리스트를 동적으로 생성했습니다. 선택한 장소로의 부드러운 시점 이동(panTo)과 여러 좌표를 한 화면에 담는 LatLngBounds를 활용해 UX를 최적화했습니다.",
      image: "/images/0UTripPlanner/map_interaction.png"
    },
    {
      title: "관계형 데이터베이스 설계 및 최적화",
      desc: "MySQL 환경에서 User와 Plan 테이블 간의 1:N 관계를 설정하고, Sequelize의 Eager Loading(Include)을 활용하여 쿼리 횟수를 줄이면서도 작성자 정보를 효율적으로 결합했습니다. 이를 통해 공유 게시판에서 각 플래너의 소유주 정보를 실시간으로 렌더링합니다.",
      image: "/images/0UTripPlanner/plan_share.png"
    }
  ],
  troubleshooting: [
    {
      title: "React LifeCycle과 외부 Library(Map) 간의 동기화 이슈",
      content: "현상: 지도 컴포넌트 렌더링 시 부모 컨테이너의 크기 계산이 끝나기 전 지도가 로드되어 레이아웃이 깨짐. 해결: useEffect와 비동기 setTimeout을 조합하여 렌더링 완료 시점을 확보하고, map.relayout()을 강제 호출하여 뷰포트를 정상화했습니다."
    },
    {
      title: "지도 레이어와 검색 UI 간의 Z-Index 충돌",
      content: "현상: 지도 위에 띄운 연관 검색어 리스트가 지도 타일 레이어 뒤로 숨거나, 부모 컨테이너의 overflow: hidden 속성에 잘려 보이는 현상. 해결: 검색 컨테이너의 Stack Context(쌓임 맥락)를 재설정하고, z-index: 100 이상 부여 및 포지셔닝 기준점(relative)을 명확히 정의하여 UI 가시성을 확보했습니다."
    },
    {
      title: "사용자 권한 검증 미들웨어 설계",
      content: "현상: URL 직접 접근을 통해 타인의 비공개 플래너를 수정/삭제할 수 있는 보안 취약점 발견. 해결: Passport.js 세션 데이터와 DB의 userId를 대조하는 커스텀 검증 미들웨어를 라우터 레벨에서 구현하여 데이터 접근 권한을 엄격히 제한했습니다."
    }
  ],
  github: "https://github.com/JamongFriend/0UTripPlanner"
};
