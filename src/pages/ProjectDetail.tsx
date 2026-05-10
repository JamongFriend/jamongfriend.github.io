import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import mermaid from 'mermaid';
// @ts-ignore
import { projects } from '../data/projects';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  sequence: {
    useMaxWidth: false,
    actorFontSize: 16,
    noteFontSize: 15,
    messageFontSize: 15,
    width: 200,
    height: 70,
  },
  flowchart: {
    useMaxWidth: false,
    nodeSpacing: 60,
    rankSpacing: 80,
  },
  themeVariables: {
    primaryColor: '#dbeafe',
    primaryTextColor: '#212529',
    primaryBorderColor: '#007bff',
    lineColor: '#007bff',
    secondaryColor: '#f1f3f5',
    tertiaryColor: '#e9ecef',
    clusterBkg: '#f1f7ff',
    clusterBorder: '#007bff',
    edgeLabelBackground: '#ffffff',
    textColor: '#212529',
    titleColor: '#212529',
    fontSize: '16px',
  },
});

type Section = { heading: string; svg: string };

const parseSections = (text: string): { heading: string; code: string }[] => {
  const results: { heading: string; code: string }[] = [];
  const lines = text.split('\n');
  let currentHeading = '';
  let inMermaid = false;
  let mermaidCode = '';

  for (const line of lines) {
    if (!inMermaid && line.startsWith('#')) {
      currentHeading = line.replace(/^#+\s*/, '');
    } else if (line.trim() === '```mermaid') {
      inMermaid = true;
      mermaidCode = '';
    } else if (inMermaid && line.trim() === '```') {
      inMermaid = false;
      results.push({ heading: currentHeading, code: mermaidCode.trim() });
    } else if (inMermaid) {
      mermaidCode += line + '\n';
    }
  }
  return results;
};

const FlowDiagram = ({ flowUrl }: { flowUrl: string }) => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch(flowUrl)
      .then(r => r.text())
      .then(async text => {
        const parsed = parseSections(text);
        const rendered: Section[] = [];
        for (let i = 0; i < parsed.length; i++) {
          try {
            const { svg } = await mermaid.render(`flow-${i}-${Date.now()}`, parsed[i].code);
            rendered.push({ heading: parsed[i].heading, svg });
          } catch (e) {
            console.error('Mermaid render error:', e);
          }
        }
        setSections(rendered);
      });
  }, [flowUrl]);

  return (
    <div>
      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#007bff', marginBottom: '0.75rem' }}>{s.heading}</h3>
          <div dangerouslySetInnerHTML={{ __html: s.svg }} style={{ overflowX: 'auto' }} />
        </div>
      ))}
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project: any = (projects as any[]).find((p: any) => p.id === id);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [flowOpen, setFlowOpen] = useState(false);

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

      {project.flow && (
        <div style={{ margin: '1.5rem 0' }}>
          <button
            onClick={() => setFlowOpen(o => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f1f7ff',
              border: '2px solid #007bff',
              borderRadius: '8px',
              padding: '1.3rem 1.8rem',
              color: '#007bff',
              fontWeight: 'bold',
              fontSize: '1.3rem',
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <span>아키텍처 플로우 다이어그램</span>
            <span style={{ fontSize: '0.85rem', transition: 'transform 0.2s', display: 'inline-block', transform: flowOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </button>
          {flowOpen && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <FlowDiagram flowUrl={project.flow} />
            </div>
          )}
        </div>
      )}

      <h2>주요 기능 (Key Features)</h2>
      <ul>
        {project.features.map((feature: any, idx: number) => (
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
                {feature.images.map((img: any, i: number) => (
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
          {project.troubleshooting.map((item: any, idx: number) => (
            <div className="trouble-section" key={idx}>
              <span className="trouble-title">{item.title}</span>
              {Array.isArray(item.content) ? (
                <ul>
                  {item.content.map((c: any, i: number) => (
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
            {project.gallery.map((img: any, idx: number) => (
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
