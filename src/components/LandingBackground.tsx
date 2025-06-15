
import React, { useRef, useEffect } from "react";

// Wave colors: dark blue over black
const LINES = [
  { amplitude: 44, freq: 1, phase: 0, color: "rgba(23,62,124,0.76)", width: 3 },
  { amplitude: 27, freq: 1.3, phase: Math.PI / 3, color: "rgba(36,81,177,0.4)", width: 2 },
  { amplitude: 19, freq: 0.9, phase: Math.PI / 1.6, color: "rgba(24,53,112,0.42)", width: 1.5 },
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
    // Animate with sin and cos oscillation for smooth undulation
    const y =
      baseY +
      Math.sin(t * opts.freq * Math.PI * 2 + opts.phase + opts.anim * 0.72) * opts.amplitude +
      Math.cos(t * opts.freq * Math.PI * 2 - opts.phase + opts.anim * 0.43) * (opts.amplitude * 0.4);

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
      // Draw smooth animated wave lines (sin & cos)
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
