
import React, { useRef, useEffect } from "react";

// A minimal animated bokeh/dots canvas for a classy black-and-white interactive effect
const DOTS = 50;
const colors = ["#fff", "#ddd", "#bbb", "#444", "#111"];
function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}
type Dot = { x: number; y: number; r: number; dx: number; dy: number; color: string };

const LandingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let running = true;
    const ctx = canvasRef.current?.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvasRef.current!.width = width * dpr;
    canvasRef.current!.height = height * dpr;
    ctx?.scale(dpr, dpr);

    // Generate dots
    let dots: Dot[] = Array.from({ length: DOTS }).map(() => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      r: randomBetween(16, 48),
      dx: randomBetween(-0.12, 0.12),
      dy: randomBetween(-0.1, 0.1),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let dot of dots) {
        ctx.globalAlpha = 0.13;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
        ctx.fillStyle = dot.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        // Move dot, bounce at edge
        dot.x += dot.dx;
        dot.y += dot.dy;
        if (dot.x < -dot.r) dot.x = width + dot.r;
        if (dot.x > width + dot.r) dot.x = -dot.r;
        if (dot.y < -dot.r) dot.y = height + dot.r;
        if (dot.y > height + dot.r) dot.y = -dot.r;
      }
      if (running) requestAnimationFrame(draw);
    }
    draw();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvasRef.current!.width = width * dpr;
      canvasRef.current!.height = height * dpr;
      ctx?.scale(dpr, dpr);
      dots = dots.map(dot => ({
        ...dot,
        x: randomBetween(0, width),
        y: randomBetween(0, height)
      }));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      running = false;
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        background: "radial-gradient(circle at 30% 70%, #111 60%, #222 100%)",
        transition: "background .8s",
      }}
      aria-hidden="true"
    />
  );
};

export default LandingBackground;
