import { useEffect, useRef, useState } from "react";
import { archive, github } from "./projects";
import "./App.css";

const paper = "https://ieeexplore.ieee.org/abstract/document/10912300";
const emotions = ["Happy", "Relaxed", "Sad", "Tense"];
const stages = [
  [
    "01 / REQUEST",
    "“Where is my order?”",
    "A fictional customer asks about an order. This walkthrough illustrates the repository’s read-only order-status workflow.",
  ],
  [
    "02 / CONTEXT",
    "Facts before answers.",
    "Authenticate the session, classify the request, and fetch the customer’s order state.",
  ],
  [
    "03 / EVIDENCE",
    "Find the applicable policy.",
    "Retrieve policy context scoped to the order facts, then determine the supported outcome.",
  ],
  [
    "04 / RESPONSE",
    "Answer. Or hand off.",
    "Explain the determination, or hand off when a reliable answer cannot be produced.",
  ],
];
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function Spectrum({ large = false }) {
  return (
    <div className={`spectrum ${large ? "large" : ""}`} aria-hidden="true">
      {Array.from({ length: large ? 88 : 44 }, (_, i) => (
        <i
          key={i}
          style={{
            "--height": `${12 + Math.pow(Math.sin(i * 0.16), 2) * 75 * Math.sin(((i + 1) / (large ? 89 : 45)) * Math.PI)}%`,
            "--delay": `${i * -0.13}s`,
          }}
        />
      ))}
    </div>
  );
}
function Music() {
  const [emotion, setEmotion] = useState("Happy");
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const audio = useRef(null);
  useEffect(() => {
    setPlaying(false);
    setError("");
  }, [emotion]);
  async function toggle() {
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      try {
        await audio.current.play();
        setPlaying(true);
      } catch {
        setError("Audio could not load. Please try again.");
      }
    }
  }
  return (
    <div className={`music-stage ${playing ? "playing" : ""}`}>
      <div className="stage-top">
        <span>EMOTION → COMPOSITION</span>
        <span>01: MIDI STUDIES</span>
      </div>
      <div className="piano-roll" aria-hidden="true">
        {Array.from({ length: 36 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 13) % 96}%`,
              top: `${12 + ((i * 17 + emotions.indexOf(emotion) * 11) % 75)}%`,
              width: `${3 + (i % 4)}%`,
            }}
          />
        ))}
        <div className="playhead" />
      </div>
      <div className="music-controls">
        <div className="emotion-tabs" aria-label="Sample emotion">
          {emotions.map((e) => (
            <button
              key={e}
              aria-pressed={emotion === e}
              onClick={() => {
                audio.current.pause();
                setEmotion(e);
              }}
            >
              {e}
            </button>
          ))}
        </div>
        <button
          className="play-button"
          onClick={toggle}
          aria-label={`${playing ? "Pause" : "Play"} ${emotion} sample`}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>
      </div>
      <audio
        ref={audio}
        src={`${process.env.PUBLIC_URL}/audio/${emotion.toLowerCase()}.mp3`}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setError("Sample unavailable. Please try again.");
        }}
        preload="none"
      />
      <p className="stage-note">
        Actual model-generated MIDI · 18-second synthesized excerpts
      </p>
      {error && <p role="status">{error}</p>}
    </div>
  );
}
function Support() {
  const [step, setStep] = useState(0);
  return (
    <div className="support-stage">
      <div className="stage-top">
        <span>
          <b className="status-dot" /> RESOLUTION WORKFLOW
        </span>
        <span>ILLUSTRATIVE WALKTHROUGH</span>
      </div>
      <div className="ticket">
        <span className="eyebrow">{stages[step][0]}</span>
        <h3>{stages[step][1]}</h3>
        <p>{stages[step][2]}</p>
      </div>
      <div className="workflow" aria-label="Workflow steps">
        {stages.map((s, i) => (
          <button
            key={s[0]}
            onClick={() => setStep(i)}
            aria-pressed={step === i}
          >
            <span>0{i + 1}</span>
            {["Request", "Context", "Evidence", "Response"][i]}
          </button>
        ))}
      </div>
      <div className="stage-bottom">
        <span>Synthetic data · In development</span>
        <button onClick={() => setStep((step + 1) % 4)}>Next step →</button>
      </div>
    </div>
  );
}
function Details({ children }) {
  return (
    <details className="details">
      <summary>
        Behind the build <span aria-hidden="true">+</span>
      </summary>
      <div>{children}</div>
    </details>
  );
}
function App() {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = archive.filter(
    (p) =>
      (filter === "All" || p.category === filter) &&
      `${p.title} ${p.description} ${p.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <a className="skip" href="#work">
        Skip to work
      </a>
      <nav className="nav">
        <a className="wordmark" href="#home" aria-label="Santhosh Naik home">
          sn<span>.</span>
        </a>
        <button
          className="menu-button"
          aria-expanded={menu}
          aria-controls="nav-links"
          onClick={() => setMenu(!menu)}
        >
          {menu ? "Close" : "Menu"}
        </button>
        <div id="nav-links" className={menu ? "nav-links open" : "nav-links"}>
          {[
            ["work", "Selected work"],
            ["archive", "Archive"],
            ["about", "About"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
          <a className="nav-contact" href="mailto:santhoshn642003@gmail.com">
            Let’s talk <Arrow />
          </a>
        </div>
      </nav>
      <main>
        <header className="hero" id="home">
          <div className="hero-light" aria-hidden="true" />
          <div className="hero-top eyebrow">
            <span> SANTHOSH NAIK / AI ENGINEER</span>
            <span>NEW JERSEY · NYC</span>
          </div>
          <div className="hero-copy">
            <p className="overline">A little cinema. A lot of curiosity.</p>
            <h1>
              Intelligence,
              <br />
              with <em>feeling.</em>
            </h1>
            <p className="hero-description">
              I build AI that works with language, creates music,
              <br className="desktop-break" /> and turns complex questions into
              useful actions.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#work">
                Explore my work <span>↓</span>
              </a>
              <a
                className="text-link"
                href={`${process.env.PUBLIC_URL}/Santhosh_Naik_Resume.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                View résumé <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-art">
            <Spectrum large />
            <span className="signal-label">SIGNAL / SOUND / POSSIBILITY</span>
          </div>
          <div className="hero-bottom">
            <span>M.S. ARTIFICIAL INTELLIGENCE · NJIT ’27</span>
            <span>SCROLL TO EXPLORE ↓</span>
            <span>RESEARCH MEETS MAKING</span>
          </div>
        </header>
        <section id="work" className="section work">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2>
                Four stories.
                <br />
                <span>One curious mind.</span>
              </h2>
            </div>
            <p>
              From the first experiment to the system behind it.
              <br />A selection of things I’m building and exploring.
            </p>
          </div>
          <article className="feature">
            <div className="feature-copy">
              <span className="project-number">01 / APPLIED AI</span>
              <h3>
                Support
                <br />
                Resolution Agent<span className="accent">.</span>
              </h3>
              <p>
                Good support starts with knowing what you can answer. A
                policy-aware agent for a fictional subscription business, with
                explicit decisions and a path to human handoff.
              </p>
              <div className="tags">
                <span>Python</span>
                <span>Policy retrieval</span>
                <span>PostgreSQL</span>
              </div>
              <a
                className="text-link"
                href={github("support-resolution-agent")}
                target="_blank"
                rel="noreferrer"
              >
                Explore the repository <Arrow />
              </a>
              <Details>
                <p>
                  The current implementation includes an explicit state machine
                  for read-only order-status queries. The repository also
                  contains retrieval, provider adapters, database controls, and
                  test suites. This is ongoing work with synthetic customers and
                  orders, not a deployed customer service.
                </p>
              </Details>
            </div>
            <Support />
          </article>
          <article className="feature reverse">
            <div className="feature-copy">
              <span className="project-number">02 / GENERATIVE SOUND</span>
              <h3>
                Music, with
                <br />
                an emotional arc<span className="accent">.</span>
              </h3>
              <p>
                EmoMusicTransformer explores a simple question: can a model
                compose with a feeling in mind? A Transformer that generates
                piano MIDI conditioned on emotion.
              </p>
              <div className="tags">
                <span>PyTorch</span>
                <span>FiLM</span>
                <span>EMOPIA</span>
              </div>
              <a
                className="text-link"
                href={github("Emo_Music-Gen")}
                target="_blank"
                rel="noreferrer"
              >
                Explore the model <Arrow />
              </a>
              <Details>
                <p>
                  FiLM conditioning at every Transformer layer combines emotion
                  labels with valence/arousal embeddings. Emotion trajectories
                  enable changes during generation without retraining. The CV
                  reports validation perplexity of 1.89; that measures token
                  prediction, not perceived musical quality. Audio here is
                  synthesized directly from repository MIDI outputs.
                </p>
              </Details>
            </div>
            <Music />
          </article>
          <div className="duo">
            <article className="small-feature">
              <div className="speech-art">
                <div className="stage-top">
                  <span>LANGUAGE / LISTENING</span>
                  <span>RESEARCH</span>
                </div>
                <Spectrum />
                <div className="transcript-art">
                  Every word
                  <br />
                  <em>matters.</em>
                </div>
              </div>
              <div className="small-copy">
                <span className="project-number">03 / SPEECH RESEARCH</span>
                <h3>
                  Making medical speech
                  <br />
                  more reliable.
                </h3>
                <p>
                  Self-training and LLM-based hypothesis selection for medical
                  speech recognition. First-author research published at IEEE
                  ICEI 2024.
                </p>
                <a
                  className="text-link"
                  href={paper}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the publication <Arrow />
                </a>
                <Details>
                  <p>
                    Research with Nitya Tiwari and K. S. Nataraj investigates
                    Whisper ASR, self-training, and selection among candidate
                    transcripts. The waveform above is decorative. The separate
                    exploratory ChatGPT correction repository is listed in the
                    archive; it is not presented as the paper’s implementation.
                  </p>
                </Details>
              </div>
            </article>
            <article className="small-feature">
              <div className="mosaic-art">
                <div className="stage-top">
                  <span>COLLABORATIVE INTELLIGENCE</span>
                  <span>MOSAIC</span>
                </div>
                <div className="mosaic-tiles" aria-hidden="true">
                  {["brief", "build", "connect", "merge"].map((x, i) => (
                    <div key={x}>
                      <span>0{i + 1}</span>
                      <strong>{x}</strong>
                      <div className="code-lines">
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="small-copy">
                <span className="project-number">04 / DEVELOPER TOOLS</span>
                <h3>
                  Separate ideas.
                  <br />
                  Shared momentum.
                </h3>
                <p>
                  Mosaic is a collaborative AI coding prototype: decompose a
                  brief, work in parallel, and bring the pieces back together.
                </p>
                <a
                  className="text-link"
                  href={github("Mosaic")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore Mosaic <Arrow />
                </a>
                <Details>
                  <p>
                    The project documents shared rooms, AI pair programming,
                    interface contracts, and semantic merging. Structured output
                    validation and post-merge syntax checks are documented; full
                    type checking and sandboxed execution remain roadmap items.
                  </p>
                </Details>
              </div>
            </article>
          </div>
        </section>
        <section className="section archive" id="archive">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / THE FULL COLLECTION</p>
              <h2>
                Always making
                <br />
                <span>something.</span>
              </h2>
            </div>
            <p>
              Research, products, prototypes, and early experiments.
              <br />
              The work behind the highlights.
            </p>
          </div>
          <div className="archive-tools">
            <div className="filters" aria-label="Filter projects">
              {[
                "All",
                "Agents",
                "Sound & language",
                "Research",
                "Web apps",
                "Experiments",
              ].map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <label className="search">
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                placeholder="Search the collection…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span aria-hidden="true">⌕</span>
            </label>
          </div>
          <p className="result-count" role="status">
            {filtered.length} projects
          </p>
          <div className="archive-grid">
            {filtered.map((p) => (
              <article className="archive-card" key={p.title}>
                <div className="archive-meta">
                  <span>{p.category}</span>
                  <span>{p.status}</span>
                </div>
                <h3>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer">
                      {p.title} <Arrow />
                    </a>
                  ) : (
                    p.title
                  )}
                </h3>
                <p>{p.description}</p>
                {!p.url && (
                  <span className="no-code">
                    {p.title === "Medical Speech Recognition" ? (
                      <a href={paper} target="_blank" rel="noreferrer">
                        Publication ↗
                      </a>
                    ) : (
                      "Public code not linked"
                    )}
                  </span>
                )}
              </article>
            ))}
          </div>
          {!filtered.length && (
            <p className="empty">
              No projects match. Try another term or category.
            </p>
          )}
        </section>
        <section className="section about" id="about">
          <div>
            <p className="eyebrow">03 / BEHIND THE SCENES</p>
            <h2>
              Engineer by practice.
              <br />
              <em>Storyteller at heart.</em>
            </h2>
          </div>
          <div className="about-body">
            <p>
              I’m Santhosh, an M.S. Artificial Intelligence student at NJIT,
              graduating in May 2027. My work moves between speech and language,
              generative models, and applications that put AI to use.
            </p>
            <p>
              I also love cinema. As vice president of In Motion, the film club
              at IIIT Dharwad, I helped organize screenings and events. I’m
              drawn to the way sound, structure, and small details come together
              to make something memorable.
            </p>
            <div className="about-facts">
              <span>IIIT DHARWAD → NJIT</span>
              <span>SPEECH · SOUND · SYSTEMS</span>
            </div>
          </div>
        </section>
        <section className="contact section" id="contact">
          <p className="eyebrow">04 / NEXT SCENE</p>
          <h2>
            Let’s build
            <br />
            something <em>good.</em>
          </h2>
          <div className="contact-row">
            <p>
              Exploring AI / ML and software engineering opportunities
              <br />
              for 2027, and thoughtful research collaborations.
            </p>
            <a
              className="button primary"
              href="mailto:santhoshn642003@gmail.com"
            >
              Start a conversation <Arrow />
            </a>
          </div>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#home">
          sn<span>.</span>
        </a>
        <span>MADE WITH CURIOSITY. FRAMED WITH INTENTION.</span>
        <div>
          <a href={github("")} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/santhosh-naik-95355a228/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>
          <a
            href={`${process.env.PUBLIC_URL}/Santhosh_Naik_Resume.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            Résumé ↗
          </a>
        </div>
      </footer>
    </>
  );
}
export default App;
