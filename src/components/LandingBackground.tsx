import React, { useRef, useEffect } from "react";

// More lines, all dark blue variants for a "dense" smooth effect
const LINES = [
  { amplitude: 44, freq: 1, phase: 0, color: "rgba(23,62,124,0.78)", width: 3.5 },
  { amplitude: 28, freq: 1.18, phase: Math.PI / 5, color: "rgba(36,81,177,0.43)", width: 2.7 },
  { amplitude: 21, freq: 0.92, phase: Math.PI / 1.8, color: "rgba(24,53,112,0.42)", width: 2 },
  { amplitude: 15, freq: 1.34, phase: Math.PI / 1.2, color: "rgba(23,62,124,0.23)", width: 1.7 },
  { amplitude: 12, freq: 0.72, phase: Math.PI/2.1, color: "rgba(25,64,130,0.15)", width: 1 },
  { amplitude: 9, freq: 1.5, phase: Math.PI/3.3, color: "rgba(19,46,87,0.13)", width: 0.8 },
];

// Draw a smooth sin or cos line for animation
function drawTrigLine(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: { color: string; amplitude: number; freq: number; phase: number; width: number; anim: number }
) {
  ctx.save();
  ctx.beginPath();
  const baseY = height * 0.64;
  for (let x = 0; x <= width; x += 2) {
    const t = x / width;
    // Smoother by limiting amplitude modulation for all, NOT crooked
    const y =
      baseY +
      Math.sin(t * opts.freq * Math.PI * 2 + opts.phase + opts.anim * 0.72) * opts.amplitude +
      Math.cos(t * opts.freq * Math.PI * 2 - opts.phase + opts.anim * 0.43) * (opts.amplitude * 0.27);

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = opts.width;
  ctx.shadowColor = opts.color;
  ctx.shadowBlur = opts.width * 3.8;
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

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height);
      // Black background
      ctx.fillStyle = "#0c1020";
      ctx.fillRect(0, 0, width, height);
      // Draw smooth animated wave lines
      for (let i = 0; i < LINES.length; i++) {
        drawTrigLine(ctx, width, height, {
          ...LINES[i],
          anim: time / 1400 + i * 1.2,
        });
      }
      if (running) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

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
        background: "#000",
        transition: "background .8s",
      }}
      aria-hidden="true"
    />
  );
};

export default LandingBackground;
