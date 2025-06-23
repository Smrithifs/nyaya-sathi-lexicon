
import React, { useRef, useEffect, useState } from "react";

/**
 * Animates children into view when they enter the viewport.
 * Usage: <SectionReveal> ... </SectionReveal>
 */
const SectionReveal: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (
        rect.top < window.innerHeight - 120 &&
        rect.bottom > 0 &&
        !revealed
      ) {
        setRevealed(true);
      }
    }
    window.addEventListener("scroll", onScroll);
    // Check on mount: if already in view
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealed]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        revealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16"
      } will-change-transform`}
    >
      {children}
    </div>
  );
};

export default SectionReveal;

