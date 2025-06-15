
import React, { useRef, useEffect } from "react";

// Abstract flowing lines background, interactive on mousemove (black/white)
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const NUM_LINES = 5;
const POINTS_PER_LINE = 26;

const LandingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animState = useRef({
    mouseX: 0.5,
    lastTime: 0,
    waves: Array.from({ length: NUM_LINES }, (_, i) => ({
      yOffset: (i + 1) / (NUM_LINES + 1),
      amp: 30 + 22 * i,
      freq: 1.2 + 0.1 * i,
      phase: Math.random() * 1000,
    })),
  });

  useEffect(() => {
    let running = true;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = window.innerWidth, height = window.innerHeight, dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    window.addEventListener("resize", resize);

    function handleMove(e: MouseEvent) {
      animState.current.mouseX = e.clientX / width;
    }
    window.addEventListener("mousemove", handleMove);

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 1;
      // bg gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#141416");
      grad.addColorStop(1, "#22222a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw flowing lines
      for (let i = 0; i < NUM_LINES; i++) {
        const { yOffset, amp, freq, phase } = animState.current.waves[i];
        ctx.save();
        ctx.beginPath();
        for (let j = 0; j < POINTS_PER_LINE; j++) {
          const t = j / (POINTS_PER_LINE - 1);
          // Wave formula, influence amplitude by mouse position
          const offset =
            Math.sin(t * Math.PI * freq + (time / 2200) * (1 + i * 0.1) + phase) *
            lerp(amp * 0.5, amp * 1.5, animState.current.mouseX);
          const px = lerp(0, width, t);
          const py = yOffset * height + offset;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.lineWidth = lerp(1.3, 2.8, i / (NUM_LINES - 1));
        ctx.strokeStyle = `rgba(255,255,255,${lerp(0.15, 0.33, i / (NUM_LINES - 1))})`;
        ctx.shadowBlur = 8 + i * 2;
        ctx.shadowColor = "#fff";
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
      if (running) requestAnimationFrame(draw);
    }
    draw(0);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
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
        transition: "background .8s",
      }}
      aria-hidden="true"
    />
  );
};

export default LandingBackground;
