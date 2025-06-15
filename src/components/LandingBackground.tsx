
import React, { useRef, useEffect } from "react";

const NUM_WAVES = 4;
const AMPLITUDE = [19, 34, 52, 68]; // Vary for depth
const COLORS = [
  "rgba(44,105,199,0.22)",
  "rgba(58,134,255,0.19)",
  "rgba(44,105,199,0.15)",
  "rgba(86,124,196,0.18)"
];

// Draw a smooth bezier-based horizontal wave
function drawSmoothWave(ctx: CanvasRenderingContext2D, width: number, height: number, opts: {
  color: string,    // fill color
  offsetY: number,  // % from top
  amplitude: number,
  freq: number,
  phase: number
}) {
  ctx.save();
  ctx.beginPath();
  const n = 5; // segments for Bezier
  const yBase = opts.offsetY * height;
  ctx.moveTo(0, yBase);

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = t * width;
    // Bezier curve: use sine for smooth up/down
    const phase = opts.phase + t * opts.freq * Math.PI * 2;
    const y =
      yBase +
      Math.sin(phase) * opts.amplitude *
      (0.7 + 0.3 * Math.cos(t * Math.PI * 2 + opts.phase * 0.5));
    ctx.lineTo(x, y);
  }
  // Down to bottom, then back
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = opts.color;
  ctx.globalAlpha = 1;
  ctx.shadowColor = opts.color.replace(/,[^)]+\)/, ",.5)"); // soft glow
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.restore();
}

const LandingBackground: React.FC<{ variant?: "about" | "default" }> = ({ variant = "default" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animState = useRef({
    drift: Math.random() * 800,
    mouseX: 0.5,
  });

  useEffect(() => {
    let running = true;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = window.innerWidth, height = window.innerHeight, dpr = window.devicePixelRatio || 1;

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

    function handleMove(e: MouseEvent) {
      animState.current.mouseX = e.clientX / width;
    }
    window.addEventListener("mousemove", handleMove);

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height);
      // Main BG
      const topGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (variant === "about") {
        topGrad.addColorStop(0, "#20204a");
        topGrad.addColorStop(0.5, "#222a52");
        topGrad.addColorStop(1, "#1d1b38");
      } else {
        topGrad.addColorStop(0, "#191c3a");
        topGrad.addColorStop(0.4, "#162a54");
        topGrad.addColorStop(1, "#13152d");
      }
      ctx.fillStyle = topGrad;
      ctx.fillRect(0,0,width,height);

      // Smooth flowing waves, from back to front
      for (let i = 0; i < NUM_WAVES; i++) {
        const frac = (i+1)/NUM_WAVES;
        drawSmoothWave(ctx, width, height, {
          color: COLORS[i % COLORS.length],
          offsetY: 0.50 + 0.09*i + Math.sin(time/3200 + i)*0.025,
          amplitude: AMPLITUDE[i]* (variant === "about" ? 0.75 : 1),
          freq: 1.40 + i*0.19 + animState.current.mouseX*0.25,
          phase: time/1900 + i*1.7 + animState.current.mouseX*1.7
        });
      }
      if (running) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    return () => {
      running = false;
      window.removeEventListener("resize", setupCanvas);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        background: variant === "about"
          ? "radial-gradient(circle at 60% 12%, #2e407f 0%, #1b1b3f 70%)"
          : "radial-gradient(circle at 80% 4%, #2c65ba 0%, #191a34 80%)",
        transition: "background .8s"
      }}
      aria-hidden="true"
    />
  );
};

export default LandingBackground;
