import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
// @ts-ignore
import { projects } from '../data/projects';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="container">
        <h1>프로젝트를 찾을 수 없습니다.</h1>
        <Link to="/" className="back-link">← 메인 페이지로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{project.title} ({project.subtitle})</h1>
      <p className="tech-stack">⚙️ Tech: {project.tech.join(', ')}</p>

      <h2>프로젝트 개요</h2>
      <p>{project.fullDescription}</p>
      {project.mainImage && (
        <img src={project.mainImage} alt="Main" className="portfolio-img" onClick={() => setLightboxImg(project.mainImage!)} style={{ cursor: 'zoom-in' }} />
      )}

      <h2>주요 기능 (Key Features)</h2>
      <ul>
        {project.features.map((feature, idx) => (
          <li key={idx}>
            <strong>{feature.title}</strong>
            <p>{feature.desc}</p>
            {feature.image && (
              <div className="image-row">
                <img src={feature.image} alt={feature.title} className="portfolio-img" onClick={() => setLightboxImg(feature.image!)} style={{ cursor: 'zoom-in' }} />
              </div>
            )}
            {feature.images && (
              <div className="image-row">
                {feature.images.map((img, i) => (
                  <img key={i} src={img} alt={`${feature.title} ${i}`} className="portfolio-img" onClick={() => setLightboxImg(img)} style={{ cursor: 'zoom-in' }} />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {project.troubleshooting.length > 0 && (
        <>
          <h2>트러블슈팅 (Troubleshooting)</h2>
          {project.troubleshooting.map((item, idx) => (
            <div className="trouble-section" key={idx}>
              <span className="trouble-title">{item.title}</span>
              {Array.isArray(item.content) ? (
                <ul>
                  {item.content.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              ) : (
                <p>{item.content}</p>
              )}
            </div>
          ))}
        </>
      )}

      {project.gallery && (
        <>
          <h2>플레이 화면 스크린샷</h2>
          <div className="gallery">
            {project.gallery.map((img, idx) => (
              <div className="thumb" key={idx} onClick={() => setLightboxImg(img)}>
                <img src={img} alt={`Screenshot ${idx}`} />
              </div>
            ))}
          </div>
        </>
      )}

      <h2>링크</h2>
      <p>🔗 <a href={project.github} target="_blank" rel="noreferrer">GitHub Repository 바로가기</a></p>

      <Link to="/" className="back-link">← 메인 페이지로 돌아가기</Link>

      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <span className="close" onClick={() => setLightboxImg(null)}>×</span>
          <img src={lightboxImg} alt="Enlarged" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
