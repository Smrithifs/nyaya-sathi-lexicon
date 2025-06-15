
import React, { useRef, useEffect } from "react";

// Animated flowing lines background, inspired by modern SaaS hero layouts (NO circles)
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const NUM_LINES = 6;
const POINTS_PER_LINE = 32;

const LandingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animState = useRef({
    lastTime: 0,
    drift: Math.random() * 1000,
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
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset/clear transform before re-scaling
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
      // Soft dark gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#18181f");
      bgGrad.addColorStop(1, "#22222a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
      // Animated glowing lines
      for (let i = 0; i < NUM_LINES; i++) {
        const yFrac = (i + 1) / (NUM_LINES + 1);
        const amp = lerp(9, 26, i / (NUM_LINES - 1));
        const freq = lerp(0.8, 1.7, i / (NUM_LINES - 1));
        const phase = animState.current.drift + i * 40;
        ctx.save();
        ctx.beginPath();
        for (let j = 0; j < POINTS_PER_LINE; j++) {
          const t = j / (POINTS_PER_LINE - 1);
          const px = lerp(0, width, t);
          const sway = Math.sin(t * Math.PI * freq + time / (1400 + i * 270) + phase) 
            * lerp(amp * 0.6, amp * 1.4, animState.current.mouseX);
          // Small random offset to detune perfect lines, for intrigue
          const perlin = Math.sin(time/1300 + i*2 + j*2.7) * 3;
          const py = yFrac * height + sway + perlin;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.lineWidth = lerp(1, 2.5, i / (NUM_LINES - 1));
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = lerp(10, 22, i / (NUM_LINES - 1));
        ctx.strokeStyle = `rgba(255,255,255,${lerp(0.07, 0.15, i / (NUM_LINES - 1))})`;
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
        background: "#191921",
        transition: "background .8s"
      }}
      aria-hidden="true"
    />
  );
};

export default LandingBackground;
