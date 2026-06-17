import { useEffect, useState } from 'react';
import './App.css';

const RESUME_URL = '/Santhosh_Naik_Resume.pdf';   // the real PDF (Open in new tab)
const RESUME_IMG = '/Santhosh_Naik_Resume.png';   // page-1 image for the preview

function ResumeViewer() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next) setLoaded(true); // lazy-load the PDF on first open
      return next;
    });
  }

  return (
    <div className={`resume-block ${open ? 'is-open' : ''}`}>
      <button
        className="resume-toggle"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="resume-panel"
      >
        <span className="resume-toggle__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="13" y2="16" />
          </svg>
        </span>
        <span className="resume-toggle__label">View résumé</span>
        <span className="resume-toggle__chev" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div className="resume-panel" id="resume-panel" role="region" aria-label="Résumé preview">
        <div className="resume-panel__inner">
          <div className="resume-paper">
            {loaded && (
              <img
                className="resume-paper__img"
                src={RESUME_IMG}
                alt="Résumé — first page"
              />
            )}
            <div className="resume-paper__sheen" aria-hidden="true"></div>
          </div>
          <div className="resume-panel__bar">
            <span className="resume-panel__hint">Preview &middot; first page</span>
            <a className="resume-open" href={RESUME_URL} target="_blank" rel="noreferrer">
              Open in new tab
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6" /><path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const skills = [
  { name: 'Python', level: 92 },
  { name: 'PyTorch', level: 85 },
  { name: 'NLP / LLMs', level: 88 },
  { name: 'React', level: 80 },
  { name: 'SQL', level: 75 },
  { name: 'Docker', level: 70 },
];

const RING_CIRC = 2 * Math.PI * 70; // r = 70

const projects = [
  {
    title: 'BloodBets',
    blurb: 'Real-time AI battle royale betting platform. 50 LLM-driven fighters compete in a survival tournament while users place live bets and sponsor fighters mid-game.',
    tags: ['SpacetimeDB', 'Groq Llama 3 70B', 'React', 'TypeScript'],
    repo: 'https://github.com/Santhosh642003/BloodBet2',
    demo: 'https://blood-bet.vercel.app/',
  },
  {
    title: 'EmoMusicTransformer',
    blurb: 'GPT-style Transformer that generates emotion-conditioned piano MIDI using FiLM conditioning on the EMOPIA dataset. Validation perplexity 1.89, with a live Gradio demo.',
    tags: ['PyTorch', 'Transformers', 'FiLM', 'Gradio'],
    repo: 'https://github.com/Santhosh642003/Emo_Music-Gen',
  },
  {
    title: 'Multimodal TEC Forecasting',
    blurb: 'Multimodal deep learning pipeline predicting global ionospheric TEC maps during geomagnetic storms, framed as residual prediction over a frozen NASA/IBM Surya foundation model. Validation RMSE 6.35 TECU, beating the persistence baseline.',
    tags: ['PyTorch', 'Foundation Models', 'Multimodal', 'HPC'],
  },
  {
    title: 'Detecting Psychological Defense Mechanisms',
    blurb: 'NLP research for the PsyDefDetect BioNLP 2026 shared task. Fine-tuned RoBERTa beating MentalBERT, with SHAP analysis and statistical significance testing.',
    tags: ['RoBERTa', 'Hugging Face', 'SHAP', 'NLP'],
  },
  {
    title: 'Campus Wellness Platform',
    blurb: 'Full-stack gamified learning app for NJIT: learning modules, quizzes, points and rewards, leaderboard, and a student dashboard with Google OAuth.',
    tags: ['Node.js', 'Express', 'React', 'PostgreSQL'],
  },
  {
    title: 'Interactive AI Education Tool',
    blurb: 'Hands-on AI teaching tool on Raspberry Pi 3 with TensorFlow. Students record data, define classes, and train image, object, and text classifiers on CPU with no prior ML background.',
    tags: ['TensorFlow', 'Raspberry Pi', 'Computer Vision', 'Education'],
  },
  {
    title: 'Anime Recommender System',
    blurb: 'Content-based anime recommender using cosine similarity over anime features to suggest similar titles from a user-selected anime.',
    tags: ['Python', 'scikit-learn', 'Recommender Systems'],
    repo: 'https://github.com/Santhosh642003/Anime-Recommendor-System',
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ringsIn, setRingsIn] = useState(false);

  // fill rings to their level after first paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setRingsIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }

  // mouse-follow gradient blob
  useEffect(() => {
    const blob = document.getElementById('blob');
    const moveBlob = (event) => {
      if (!blob) return;
      blob.animate(
        { left: `${event.clientX}px`, top: `${event.clientY}px` },
        { duration: 3000, fill: 'forwards' }
      );
    };
    document.addEventListener('pointermove', moveBlob);
    return () => document.removeEventListener('pointermove', moveBlob);
  }, []);

  // name scramble on hover
  useEffect(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let interval = null;
    const nameElement = document.querySelector('.Name');
    if (!nameElement) return;
    nameElement.onmouseover = () => {
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        nameElement.innerText = nameElement.innerText
          .split('')
          .map((letter, index) =>
            index < iteration
              ? nameElement.dataset.value[index]
              : letters[Math.floor(Math.random() * 26)]
          )
          .join('');
        if (iteration >= nameElement.dataset.value.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    };
  }, []);

  return (
    <div className="main-body">
      <div id="blob" className="blob"></div>
      <div className="overlay"></div>

      <nav className="Navbar">
        <span className="logo" onClick={() => scrollTo('hero')}>SN</span>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">☰</button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <p onClick={() => scrollTo('about-section')}>About</p>
          <p onClick={() => scrollTo('skill-section')}>Skills</p>
          <p onClick={() => scrollTo('projects-section')}>Projects</p>
          <p onClick={() => scrollTo('contact-section')}>Contact</p>
        </div>
      </nav>

      <header id="hero" className="intro">
        <div className="Greetings">Hello,</div>
        <div className="Name" data-value="I'M SANTHOSH NAIK">I'M SANTHOSH NAIK</div>
        <div className="bio">AI / ML Engineer &middot; NLP &amp; Multimodal Deep Learning</div>
        <div className="hero-cta">
          <button className="btn primary" onClick={() => scrollTo('projects-section')}>View Projects</button>
          <a className="btn ghost" href="mailto:santhoshn642003@gmail.com">Get in touch</a>
        </div>
      </header>

      <section id="about-section" className="about">
        <h2 className="section-head">About Me</h2>
        <p className="about-info">
          I am an M.S. Artificial Intelligence student at NJIT focused on NLP, large language
          models, and multimodal deep learning. I am a published IEEE author and I work as a
          research assistant building deep learning pipelines for real scientific problems.
        </p>
        <p className="about-info">
          What I care about most is shipping. I have built and deployed real systems &mdash; a
          real-time multi-agent AI platform, an emotion-conditioned music generation model with a
          live demo, and a full-stack gamified learning app used on campus &mdash; taking each from
          idea to something people can actually use.
        </p>
        <p className="about-info">
          My research spans medical speech recognition, mental-health NLP, and ionospheric
          forecasting with foundation models. I move fast with modern AI tooling and care about
          knowing when to trust a model and when to constrain it.
        </p>
      </section>

      <section id="skill-section" className="skills">
        <h2 className="section-head">Skills</h2>
        <div className="skill-container">
          {skills.map((s) => {
            const offset = ringsIn ? RING_CIRC * (1 - s.level / 100) : RING_CIRC;
            return (
              <div className="skill" key={s.name}>
                <div className="outer">
                  <div className="inner">
                    <div className="skillName">{s.name}</div>
                    <div className="skillPct">{s.level}%</div>
                  </div>
                </div>
                <svg width="160" height="160">
                  <defs>
                    <linearGradient id="grad">
                      <stop offset="0%" stopColor="#7afcd0" />
                      <stop offset="100%" stopColor="#9d7bff" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="ring"
                    cx="80" cy="80" r="70"
                    strokeLinecap="round"
                    stroke="url(#grad)"
                    style={{ strokeDasharray: RING_CIRC, strokeDashoffset: offset }}
                  />
                </svg>
              </div>
            );
          })}
        </div>
        <div className="skill-tags">
          <div><span className="tag-label">ML / DL</span> TensorFlow &middot; Hugging Face Transformers &middot; scikit-learn &middot; NumPy &middot; Pandas &middot; Keras</div>
          <div><span className="tag-label">Web &amp; Infra</span> Node.js &middot; Express &middot; PostgreSQL &middot; AWS &middot; Slurm / HPC &middot; Vercel &middot; Gradio</div>
          <div><span className="tag-label">Languages</span> Python &middot; C++ &middot; C &middot; SQL &middot; JavaScript &middot; TypeScript</div>
        </div>
      </section>

      <section id="projects-section" className="projects">
        <h2 className="section-head">Projects</h2>
        <div className="project-grid">
          {projects.map((p) => (
            <article className="project-card" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <div className="project-tags">
                {p.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
              <div className="project-links">
                {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">Code</a>}
                {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">Live demo</a>}
                {!p.repo && !p.demo && <span className="link-soon"></span>}
              </div>
            </article>
          ))}
        </div>
        <div className="publication">
          <span className="pub-badge">Publication</span>
          D. S. Naik, N. Tiwari, K. S. Nataraj. &ldquo;Self-Training and Error Correction using
          Large Language Models for Medical Speech Recognition.&rdquo; <em>IEEE ICEI 2024.</em>
          <span className="pub-links">
            <a href="https://ieeexplore.ieee.org/abstract/document/10912300" target="_blank" rel="noreferrer">IEEE Xplore</a>
            <a href="https://www.researchgate.net/publication/389793950_Self-Training_and_Error_Correction_using_Large_Language_Models_for_Medical_Speech_Recognition" target="_blank" rel="noreferrer">ResearchGate</a>
          </span>
        </div>
      </section>

      <section id="contact-section" className="ContactMe">
        <h2 className="section-head">Contact</h2>
        <p className="contact-line">Open to AI / ML internships. The fastest way to reach me:</p>
        <div className="contact-links">
          <a href="mailto:santhoshn642003@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/santhosh-naik-95355a228/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Santhosh642003" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <div className="contact-resume">
          <ResumeViewer />
        </div>
      </section>

      <footer className="footer">Built by Santhosh Naik</footer>
    </div>
  );
}

export default App;