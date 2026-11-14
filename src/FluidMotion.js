import { useEffect, useRef } from "react";

// A single animation loop drives the canvas and pointer decoration, without React rerenders.
export default function FluidMotion() {
  const canvasRef = useRef(null);
  const trailRef = useRef(null);
  useEffect(() => {
    if (!window.matchMedia) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let stop = () => {};
    function setup() {
      stop();
      if (motion.matches || !pointer.matches) return;
      const canvas = canvasRef.current,
        trail = trailRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const hero = document.querySelector(".hero");
      let width = 0,
        height = 0,
        frame = 0,
        visible = true,
        active = false;
      let x = window.innerWidth * 0.7,
        y = 350,
        tx = x,
        ty = y;
      let target = null,
        targetRect = null,
        previousTime = 0,
        clock = 0;
      const resetTarget = () => {
        if (target) {
          target.style.removeProperty("--rx");
          target.style.removeProperty("--ry");
          target.style.removeProperty("--mx");
          target.style.removeProperty("--my");
        }
        target = null;
        targetRect = null;
      };
      function resize() {
        width = hero.clientWidth;
        height = hero.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        resetTarget();
      }
      function move(e) {
        if (e.pointerType === "touch") return;
        tx = e.clientX;
        ty = e.clientY;
        active = true;
        trail.classList.add("active");
        const next = e.target.closest?.(
          ".support-stage, .music-stage, .speech-art, .mosaic-art, .hero-actions .button, .contact .button",
        );
        if (target !== next) {
          resetTarget();
          target = next;
          targetRect = next?.getBoundingClientRect();
        }
        trail.classList.toggle(
          "over-control",
          !!e.target.closest?.("a, button, summary, input"),
        );
      }
      function leave() {
        active = false;
        trail.classList.remove("active");
        resetTarget();
      }
      function draw(now) {
        frame = 0;
        if (document.hidden) return;
        const delta = Math.min(40, now - (previousTime || now));
        previousTime = now;
        clock += delta;
        const ease = 1 - Math.exp(-delta / 100);
        x += (tx - x) * ease;
        y += (ty - y) * ease;
        trail.style.transform = `translate3d(${x}px,${y}px,0)`;
        if (target && targetRect) {
          const px = Math.max(
            -0.5,
            Math.min(0.5, (tx - targetRect.left) / targetRect.width - 0.5),
          );
          const py = Math.max(
            -0.5,
            Math.min(0.5, (ty - targetRect.top) / targetRect.height - 0.5),
          );
          target.style.setProperty("--rx", `${-py * 6}deg`);
          target.style.setProperty("--ry", `${px * 7}deg`);
          target.style.setProperty("--mx", `${px * 9}px`);
          target.style.setProperty("--my", `${py * 9}px`);
        }
        if (visible) {
          ctx.clearRect(0, 0, width, height);
          const t = clock * 0.00024;
          const localY = y - hero.getBoundingClientRect().top;
          const bend = active ? (x / width - 0.5) * 55 : 0;
          for (let line = 0; line < 30; line++) {
            ctx.beginPath();
            for (let step = 0; step <= 100; step++) {
              const u = step / 100;
              const px = width * (0.34 + u * 0.75);
              const envelope = Math.sin(u * Math.PI);
              const attraction = active
                ? Math.exp(-Math.pow((px - x) / 220, 2)) *
                  (localY - height * 0.49) *
                  0.22
                : 0;
              const py =
                height * 0.49 +
                Math.sin(u * 8 + t + line * 0.075) * height * 0.15 * envelope +
                (line - 15) * 7 * envelope +
                Math.sin(u * 4 - t) * 45 +
                attraction +
                bend * envelope;
              if (!step) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = `hsla(${185 + line * 4.5}, 95%, 68%, ${0.18 + Math.sin((line / 30) * Math.PI) * 0.36})`;
            ctx.lineWidth = line % 5 === 0 ? 1.5 : 0.7;
            ctx.stroke();
          }
        }
        frame = requestAnimationFrame(draw);
      }
      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else if (!frame) {
          previousTime = 0;
          frame = requestAnimationFrame(draw);
        }
      };
      const onScroll = () => {
        resetTarget();
      };
      const observer =
        typeof IntersectionObserver !== "undefined"
          ? new IntersectionObserver(([e]) => {
              visible = e.isIntersecting;
            })
          : null;
      observer?.observe(hero);
      resize();
      document.documentElement.classList.add("fluid-enabled");
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      window.addEventListener("blur", leave);
      window.addEventListener("resize", resize);
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      frame = requestAnimationFrame(draw);
      stop = () => {
        cancelAnimationFrame(frame);
        observer?.disconnect();
        resetTarget();
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
        window.removeEventListener("blur", leave);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
        document.documentElement.classList.remove("fluid-enabled");
        trail.classList.remove("active");
        ctx.clearRect(0, 0, width, height);
      };
    }
    setup();
    motion.addEventListener("change", setup);
    pointer.addEventListener("change", setup);
    return () => {
      stop();
      motion.removeEventListener("change", setup);
      pointer.removeEventListener("change", setup);
    };
  }, []);
  return (
    <>
      <canvas className="fluid-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="pointer-trail" ref={trailRef} aria-hidden="true">
        <i />
        <span />
      </div>
    </>
  );
}
