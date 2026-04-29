export const soulofherbseller = {
  id: "soulofherbseller",
  title: "Soul of Herb Seller",
  subtitle: "UE5 기반 액션 어드벤처",
  tech: ["Unreal Engine 5", "Blueprint", "C++"],
  description: "Unreal Engine 5 기반 메트로바니아 장르 플렛포머 게임. 식물 채집 및 보스 전투 시스템.",
  fullDescription: "Soul of Herb Seller는 식물을 채집하고, 수집한 재료로 캐릭터를 강화하며 보스 몬스터를 처치하는 3D 액션 어드벤처 게임입니다. Unreal Engine 5의 Blueprint를 활용하여 이벤트 중심 게임 로직과 캐릭터 상호작용을 구현했습니다. 데이터 흐름과 상태 전이를 객체 단위로 관리하며, 유지보수가 용이한 구조로 설계했습니다.",
  features: [
    { title: "식물 채집 시스템", desc: "미니게임 형태로 구현된 채집 로직 – 일정 시간 내 입력 성공 시 아이템 획득" },
    { title: "보스 몬스터 전투", desc: "보스 AI와의 전투 패턴 설계 (공격, 회피, 피격 상태 전이)" },
    { title: "상태 관리", desc: "체력, 버프, 채집 성공률 등 플레이어 상태 변수를 중앙 관리" },
    { title: "상태 전이 관리", desc: "Idle → Gathering → Combat → Dead 등 상태머신 기반의 전이 구조 구현" }
  ],
  troubleshooting: [
    { title: "맵 전환 시 상태 유지 문제", content: "맵 이동 시 변수 초기화 문제 발생 → SaveGame 시스템 도입으로 플레이어 데이터 유지" },
    { title: "위치 리셋 버그", content: "미니게임 종료 후 플레이어 위치가 원점으로 이동 → GetActorLocation() 백업 및 복원 로직 추가" },
    { title: "AI 타겟팅 오류", content: "보스 AI의 TargetActor 참조 끊김 문제 → Behavior Tree BlackBoard 재설정으로 안정화" }
  ],
  github: "https://github.com/JamongFriend/SoulOfHerbSeller",
  gallery: ["/images/shot-01.png", "/images/shot-02.png", "/images/shot-03.png", "/images/shot-04.png"]
};
