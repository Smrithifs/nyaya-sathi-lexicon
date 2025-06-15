
import React, { useRef, useEffect } from "react";

// Animated flowing blue waves background, darker and more vibrant
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const NUM_WAVES = 5;
const POINTS_PER_WAVE = 40;

// Utility to make smooth color gradients for vibrant blues and hints of purple
function getWaveGradient(ctx: CanvasRenderingContext2D, width: number, i: number) {
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, `rgba(${32 + i*12},${54 + i*18},${125 + i*22},0.93)`);
  grad.addColorStop(0.7, `rgba(${44 + i*18},${95 + i*14},${199 + i*35},0.84)`);
  grad.addColorStop(1, `rgba(${71 + i*12},${68 + i*9},${180 + i*20},0.85)`);
  return grad;
}

const LandingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animState = useRef({
    lastTime: 0,
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

      // Rich, vibrant dark blue gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#152044");
      bgGrad.addColorStop(0.4, "#191a34");
      bgGrad.addColorStop(0.7, "#192258");
      bgGrad.addColorStop(1, "#121429");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Animated glowing colorful wave lines
      for (let i = 0; i < NUM_WAVES; i++) {
        const yFrac = 0.23 + 0.13 * i;
        const amp = lerp(22, 65, i / (NUM_WAVES - 1));
        const freq = lerp(1, 2.1, i / (NUM_WAVES - 1));
        const wavePhase = animState.current.drift + i * 22;
        ctx.save();
        ctx.beginPath();
        for (let j = 0; j < POINTS_PER_WAVE; j++) {
          const t = j / (POINTS_PER_WAVE - 1);
          const px = lerp(0, width, t);
          const sway = Math.sin(t * Math.PI * freq + time / (1800 + i * 250) + wavePhase)
            * lerp(amp * 0.8, amp * 1.35, 0.45 + 0.40 * animState.current.mouseX);
          const perlin = Math.sin(time/1700 + i*2 + j*2.6) * 4;
          const py = yFrac * height + sway + perlin;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.shadowColor = ["#6bcafe","#61b3d6","#538be2","#5d69cd","#8e9ef2"][i % 5];
        ctx.shadowBlur = 22 + i * 6;
        ctx.lineWidth = lerp(2.2, 4.4, i / (NUM_WAVES - 1));
        ctx.strokeStyle = getWaveGradient(ctx, width, i);
        ctx.stroke();
        ctx.restore();
      }
      if (running) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    return () => {
      running = false;
      window.removeEventListener("resize", setupCanvas);
      window.removeEventListener("mousemove", handleMove);
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
        background: "radial-gradient(at 70% 10%, #2c65ba 0%, #191a34 80%)",
        transition: "background .8s"
      }}
      aria-hidden="true"
    />
  );
};

export default LandingBackground;

