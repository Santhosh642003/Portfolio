import { useEffect, useRef, useState } from "react";
import { archive } from "./projects";
import "./Studio.css";

const stations = [
  ["listen", "01", "The listening booth", "Medical speech research", "speech"],
  ["compose", "02", "The scoring desk", "Emotion-conditioned music", "music"],
  ["resolve", "03", "The agent console", "Support Resolution Agent", "support"],
  [
    "collaborate",
    "04",
    "The shared workspace",
    "Mosaic · AI developer tools",
    "mosaic",
  ],
];
export function StudioRoom() {
  const [mode, setMode] = useState("listen");
  return (
    <section
      className={`studio-room mode-${mode}`}
      aria-label="Interactive signal studio"
    >
      <div className="room-header">
        <span>
          <i /> STUDIO 01 / AFTER HOURS
        </span>
        <span>SELECT A STATION</span>
      </div>
      <div className="room-space">
        <div className="room-grid" aria-hidden="true" />
        <div className="room-window" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="signal-object" aria-hidden="true">
          <div className="signal-rings">
            {Array.from({ length: 22 }, (_, i) => (
              <i key={i} style={{ "--i": i }} />
            ))}
          </div>
          <div className="signal-base" />
          <span>{mode.toUpperCase()} / SIGNAL FIELD</span>
        </div>
        <div className="room-caption">
          <span>ARTIFICIAL INTELLIGENCE.</span>
          <strong>Human frequency.</strong>
          <p>
            One studio. Four ways of turning a signal into something useful.
          </p>
        </div>
      </div>
      <div className="station-tabs" aria-label="Studio station">
        {stations.map(([id, n, title, sub]) => (
          <button
            key={id}
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
          >
            <span>
              {n} / {id.toUpperCase()}
            </span>
            <strong>{title}</strong>
            <small>{sub}</small>
          </button>
        ))}
      </div>
      <div className="station-footer">
        <span>Interactive sculpture · Explore the actual work below</span>
        <a href={`#${stations.find((s) => s[0] === mode)[4]}`}>
          Enter {stations.find((s) => s[0] === mode)[2].toLowerCase()} ↗
        </a>
      </div>
    </section>
  );
}

export default function StudioTerminal({ onGrade, onSearch }) {
  const [command, setCommand] = useState("");
  const [lines, setLines] = useState([
    { text: "Signal Studio / interactive portfolio console" },
    {
      text: "Type help, or try a command below. Commands run locally in this page.",
    },
  ]);
  const [history, setHistory] = useState([]);
  const [position, setPosition] = useState(-1);
  const input = useRef(null);
  const output = useRef(null);
  const audio = useRef(null);
  const mounted = useRef(true);
  const playback = useRef(0);
  const append = (text, href) => {
    if (mounted.current) setLines((old) => [...old.slice(-59), { text, href }]);
  };
  useEffect(() => {
    mounted.current = true;
    const player = audio.current;
    return () => {
      mounted.current = false;
      player?.pause();
    };
  }, []);
  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [lines]);
  useEffect(() => {
    const shortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document
          .getElementById("terminal")
          ?.scrollIntoView({ behavior: "auto", block: "center" });
        input.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => {
    const stopOther = (e) => {
      if (e.target !== audio.current) {
        playback.current++;
        audio.current?.pause();
      }
    };
    document.addEventListener("play", stopOther, true);
    return () => document.removeEventListener("play", stopOther, true);
  }, []);
  async function run(raw) {
    const clean = raw.trim().slice(0, 160);
    if (!clean) return;
    setCommand("");
    setHistory((h) => [clean, ...h].slice(0, 30));
    setPosition(-1);
    append(`› ${clean}`);
    const [verb, ...rest] = clean.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");
    if (verb === "clear") {
      setLines([]);
      return;
    }
    if (verb === "help") {
      append(
        "projects · find <text> · open <station> · play <emotion> · stop · theme <grade> · whoami · resume · clear",
      );
      append(
        "Stations: support, music, speech, mosaic. Emotions: happy, relaxed, sad, tense. Grades: electric, ultraviolet, acid.",
      );
      return;
    }
    if (verb === "whoami") {
      append(
        "Santhosh Naik — NJIT M.S. Artificial Intelligence, graduating May 2027. Speech research, generative music, and AI applications. Film lover; former In Motion film-club vice president.",
      );
      return;
    }
    if (verb === "projects") {
      append(
        "Featured: Support Resolution Agent [in development] / EmoMusicTransformer / Medical ASR [IEEE ICEI 2024] / Mosaic [prototype]",
      );
      append("Browse all 28 projects", "#archive");
      return;
    }
    if (verb === "find") {
      if (!arg) {
        append("Usage: find <project or topic>");
        return;
      }
      const matches = archive.filter((p) =>
        `${p.title} ${p.category} ${p.description}`.toLowerCase().includes(arg),
      );
      onSearch(arg);
      append(
        `${matches.length} matching project${matches.length === 1 ? "" : "s"} in the archive.`,
      );
      matches
        .slice(0, 8)
        .forEach((p) => append(`${p.title} — ${p.status}`, p.url || undefined));
      if (matches.length) append("View filtered archive", "#archive");
      return;
    }
    if (verb === "open") {
      const targets = {
        support: "support",
        agent: "support",
        music: "music",
        speech: "speech",
        mosaic: "mosaic",
        archive: "archive",
        about: "about",
      };
      if (!targets[arg]) {
        append("Choose: support, music, speech, mosaic, archive, about.");
        return;
      }
      document
        .getElementById(targets[arg])
        ?.scrollIntoView({ behavior: "auto", block: "start" });
      append(`Opened ${arg}.`);
      return;
    }
    if (verb === "theme") {
      if (!["electric", "ultraviolet", "acid"].includes(arg)) {
        append("Choose a grade: electric, ultraviolet, acid.");
        return;
      }
      onGrade(arg);
      append(`Studio lighting: ${arg}.`);
      return;
    }
    if (verb === "resume") {
      append(
        "Open Santhosh’s résumé",
        `${process.env.PUBLIC_URL}/Santhosh_Naik_Resume.pdf`,
      );
      return;
    }
    if (verb === "stop") {
      playback.current++;
      audio.current.pause();
      append("Playback stopped.");
      return;
    }
    if (verb === "play") {
      if (!["happy", "relaxed", "sad", "tense"].includes(arg)) {
        append("Choose an emotion: happy, relaxed, sad, tense.");
        return;
      }
      const token = ++playback.current;
      document.querySelectorAll("audio").forEach((a) => a.pause());
      audio.current.src = `${process.env.PUBLIC_URL}/audio/${arg}.mp3`;
      try {
        await audio.current.play();
        if (token === playback.current)
          append(
            `Playing ${arg} — actual generated MIDI, synthesized as an 18-second excerpt.`,
          );
      } catch {
        if (token === playback.current)
          append(
            "Playback unavailable. Try again or use the scoring desk below.",
          );
      }
      return;
    }
    append(`Unknown command: ${verb}. Type help for available commands.`);
  }
  return (
    <section
      id="terminal"
      className="studio-terminal"
      aria-label="Portfolio terminal"
    >
      <div className="terminal-title">
        <span>
          <i />
          <i />
          <i /> signal / console
        </span>
        <kbd>CTRL / ⌘ K</kbd>
      </div>
      <div
        className="terminal-output"
        ref={output}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        tabIndex="0"
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className={line.text.startsWith("›") ? "command-echo" : ""}
          >
            {line.href ? (
              <a
                href={line.href}
                target={line.href.startsWith("#") ? undefined : "_blank"}
                rel="noreferrer"
              >
                {line.text} ↗
              </a>
            ) : (
              line.text
            )}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(command);
        }}
        className="terminal-form"
      >
        <label htmlFor="terminal-command">
          visitor<span>@</span>studio ~
        </label>
        <input
          id="terminal-command"
          ref={input}
          aria-label="Terminal command"
          value={command}
          maxLength={160}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const next = Math.min(position + 1, history.length - 1);
              if (next >= 0) {
                setPosition(next);
                setCommand(history[next]);
              }
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              const next = Math.max(-1, position - 1);
              setPosition(next);
              setCommand(next < 0 ? "" : history[next]);
            }
          }}
          placeholder="help"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
        />
        <button type="submit" aria-label="Run command">
          ↵
        </button>
      </form>
      <div className="terminal-shortcuts">
        {[
          "projects",
          "play relaxed",
          "theme ultraviolet",
          "whoami",
          "stop",
        ].map((c) => (
          <button key={c} onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
      <audio
        ref={audio}
        preload="none"
        onEnded={() => append("Sample finished.")}
      />
    </section>
  );
}
