
import React, { useRef, useEffect } from "react";

const NUM_WAVES = 4;
const AMPLITUDE = [19, 34, 52, 68];
const COLORS = [
  "rgba(44,105,199,0.22)",
  "rgba(58,134,255,0.19)",
  "rgba(44,105,199,0.15)",
  "rgba(86,124,196,0.18)"
];

// Draw ultra-smooth, sine-based wave
function drawSmoothWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: {
    color: string;
    offsetY: number;
    amplitude: number;
    freq: number;
    phase: number;
  }
) {
  ctx.save();
  ctx.beginPath();
  const segments = 80; // Much higher than before, for real smoothness
  const yBase = opts.offsetY * height;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = t * width;
    const phase = opts.phase + t * opts.freq * Math.PI * 2;
    const y =
      yBase +
      Math.sin(phase) *
        opts.amplitude *
        (0.9 + 0.1 * Math.cos(t * Math.PI * 2 + opts.phase * 0.3));
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = opts.color;
  ctx.globalAlpha = 1;
  ctx.shadowColor = opts.color.replace(/,[^)]+\)/, ",.21)");
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.restore();
}

const LandingBackground: React.FC<{ variant?: "about" | "default" }> = ({
  variant = "default",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animState = useRef({
    drift: Math.random() * 800,
    mouseX: 0.5,
  });

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
        topGrad.addColorStop(0, "#151d38");
        topGrad.addColorStop(0.4, "#192d4f");
        topGrad.addColorStop(1, "#101331");
      }
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height);

      // Extra color bursts for vibrancy
      if (variant === "default") {
        const radial = ctx.createRadialGradient(
          width * 0.6,
          height * 0.11,
          width * 0.2,
          width * 0.5,
          height * 0.6,
          width
        );
        radial.addColorStop(0, "rgba(50,95,182,0.17)");
        radial.addColorStop(0.4, "rgba(44,105,199,0.12)");
        radial.addColorStop(1, "rgba(19,24,44,0.06)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      }

      // SMOOTH flowing waves back to front
      for (let i = 0; i < NUM_WAVES; i++) {
        drawSmoothWave(ctx, width, height, {
          color: COLORS[i % COLORS.length],
          offsetY: 0.49 + 0.13 * i + Math.sin(time / 3200 + i) * 0.017,
          amplitude: AMPLITUDE[i] * (variant === "about" ? 0.7 : 1),
          freq: 1.13 + i * 0.22 + animState.current.mouseX * 0.29,
          phase: time / 2600 + i * 1.1 + animState.current.mouseX * 1.23,
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
        background:
          variant === "about"
            ? "radial-gradient(circle at 60% 12%, #2e407f 0%, #1b1b3f 70%)"
            : "radial-gradient(circle at 80% 4%, #2c65ba 0%, #191a34 80%)",
        transition: "background .8s",
      }}
      aria-hidden="true"
    />
  );
};

export default LandingBackground;
