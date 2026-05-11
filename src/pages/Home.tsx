import { Link } from 'react-router-dom';
// @ts-ignore
import { projects } from '../data/projects';

const Home = () => {
  return (
    <>
      <section>
        <h2>📂 주요 프로젝트</h2>
        <ul className="project-list">
          {projects.map((project: any) => (
            <li key={project.id}>
              <span className="project-title">{project.title} ({project.subtitle})</span>
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
