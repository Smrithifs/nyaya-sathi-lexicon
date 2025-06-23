
import React, { useRef, useEffect } from "react";

const LINES = [
  { amplitude: 50, freq: 1, phase: 0, color: "rgba(36,113,204,0.63)", width: 4 },
  { amplitude: 32, freq: 1.15, phase: Math.PI / 4, color: "rgba(40,175,233,0.38)", width: 2.7 },
  { amplitude: 22, freq: 0.92, phase: Math.PI / 2, color: "rgba(72,186,255,0.38)", width: 2 },
  { amplitude: 17, freq: 1.36, phase: Math.PI / 1.2, color: "rgba(55,112,234,0.15)", width: 1.6 },
  { amplitude: 12, freq: 0.75, phase: Math.PI / 1.5, color: "rgba(65,133,255,0.10)", width: 1 },
  { amplitude: 9, freq: 1.6, phase: Math.PI / 2.1, color: "rgba(50,90,207,0.08)", width: 0.8 },
  { amplitude: 36, freq: 1.2, phase: Math.PI / 3.2, color: "rgba(21,60,150,0.23)", width: 2.5 },
  { amplitude: 60, freq: 0.78, phase: Math.PI / 1.1, color: "rgba(36,171,244,0.23)", width: 3.8 }
];

function drawTrigLine(ctx, width, height, opts) {
  ctx.save();
  ctx.beginPath();
  const baseY = height * 0.62;
  for (let x = 0; x <= width; x += 2) {
    const t = x / width;
    const y =
      baseY +
      Math.sin(t * opts.freq * Math.PI * 2 + opts.phase + opts.anim * 1.1) * opts.amplitude +
      Math.cos(t * opts.freq * Math.PI * 2 - opts.phase + opts.anim * 0.6) * (opts.amplitude * 0.22);

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = opts.width;
  ctx.shadowColor = opts.color;
  ctx.shadowBlur = opts.width * 3.4;
  ctx.globalAlpha = 0.88;
  ctx.stroke();
  ctx.restore();
}

const LandingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let running = true;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = window.innerWidth,
      height = window.innerHeight,
      dpr = window.devicePixelRatio || 1;
    function setupCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    let landingAnim = 0, finished = false;
    function landingEffect(time: number) {
      landingAnim += 0.04;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#121a36";
      ctx.fillRect(0, 0, width, height);

      const progress = Math.min(1, landingAnim / 1.3);
      LINES.forEach((line, i) => {
        drawTrigLine(ctx, width, height, {
          ...line,
          amplitude: line.amplitude * progress * (1 + i * 0.08),
          anim: time / 1100 + i,
        });
      });

      if (progress < 1 && running) requestAnimationFrame(landingEffect);
      else {
        finished = true;
        requestAnimationFrame(draw);
      }
    }
    function draw(time: number) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#121a36";
      ctx.fillRect(0, 0, width, height);
      LINES.forEach((line, i) =>
        drawTrigLine(ctx, width, height, {
          ...line,
          anim: time / 1100 + i * 1.26,
        })
      );
      if (running && finished) requestAnimationFrame(draw);
    }
    landingEffect(0);

    return () => {
      running = false;
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        background: "#121a36",
        transition: "background .8s",
      }}
      aria-hidden="true"
    />
  );
};

export default LandingBackground;

