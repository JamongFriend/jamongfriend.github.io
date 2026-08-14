import { Link } from 'react-router-dom';
// @ts-ignore
import { projects } from '../data/projects';

const Home = () => {
  return (
    <>
      <section>
        <h2>👋 자기소개</h2>
        <p>
          안녕하세요, 백엔드 개발자 <strong>이호규</strong>입니다.
        </p>
        <p>
          <strong>Spring Boot</strong>와 <strong>Node.js</strong> 기반의 서버 개발을 중심으로,
          Android 네이티브 앱과 React 프론트엔드까지 직접 구현하는 풀스택 역량을 보유하고 있습니다.
          실시간 채팅 서비스의 WebSocket 인증 이중 레이어 설계, IDOR 취약점 직접 발견 및 수정 등
          보안과 안정성을 우선시하는 개발 방식을 추구합니다.
        </p>
        <p>
          단순히 동작하는 코드를 넘어, 문제의 <strong>원인을 분석하고 구조적으로 해결</strong>하는 것을
          중요하게 생각합니다. N+1 쿼리 최적화, Race Condition 처리, Docker 기반 배포 자동화 등
          실제 운영 환경을 고려한 경험을 쌓아왔습니다.
        </p>
        <ul style={{ marginTop: '1rem', color: '#495057' }}>
          <li>🎓 한국성서대학교 컴퓨터소프트웨어학과 졸업</li>
          <li>💼 주요 관심 분야: 백엔드 시스템 설계, RESTful API, 인증/보안, 배포 자동화</li>
        </ul>
      </section>

      <section>
        <h2>📂 주요 프로젝트</h2>
        <ul className="project-list">
          {projects.map((project: any) => (
            <li key={project.id}>
              <span className="project-title">{project.title} ({project.subtitle})</span>
              {(project.period || project.role) && (
                <div style={{ fontSize: '0.85rem', color: '#868e96', marginTop: '4px' }}>
                  {project.period && <span>📅 {project.period}</span>}
                  {project.period && project.role && <span> &nbsp;·&nbsp; </span>}
                  {project.role && <span>🧑‍💻 {project.role}</span>}
                </div>
              )}
              <div className="project-tags">
                {project.tech.map((tag: any) => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="links">
                <Link to={`/project/${project.id}`}>🔗 상세 보기</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>📞 연락처</h2>
        <p>Email: <a href="mailto:ghrb6769@gmail.com">ghrb6769@gmail.com</a></p>
        <p>GitHub: <a href="https://github.com/JamongFriend" target="_blank" rel="noreferrer">https://github.com/JamongFriend</a></p>
      </section>

      <section>
        <h2>📎 첨부 자료</h2>
        <p><a href="/이호규_이력서.pdf" target="_blank" rel="noreferrer">📄 이력서 다운로드</a></p>
      </section>
    </>
  );
};

export default Home;
