
import React from "react";

// Minimalist scales of justice (law symbol) SVG in white/dark blue
const LawSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    className={className}
    aria-label="Scales of Justice Law Symbol"
    stroke="#173e7c"
    strokeWidth={2.2}
    style={{ display: "block" }}
  >
    {/* Central pillar */}
    <rect x="37" y="18" width="6" height="40" rx="2.4" fill="#173e7c" />
    {/* Top circle */}
    <circle cx="40" cy="17" r="5" fill="#091431" stroke="#173e7c" />
    {/* Crossbar */}
    <rect x="20" y="27" width="40" height="3" rx="1.4" fill="#173e7c" />
    {/* Left chain */}
    <line x1="25" y1="30" x2="16" y2="50" />
    {/* Right chain */}
    <line x1="55" y1="30" x2="64" y2="50" />
    {/* Left scale */}
    <ellipse cx="16" cy="55" rx="7" ry="4" fill="#091431" stroke="#173e7c" />
    {/* Right scale */}
    <ellipse cx="64" cy="55" rx="7" ry="4" fill="#091431" stroke="#173e7c" />
    {/* Base */}
    <rect x="28" y="60" width="24" height="5" rx="2.4" fill="#173e7c" />
  </svg>
);

export default LawSymbol;
