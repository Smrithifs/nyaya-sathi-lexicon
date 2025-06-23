
import React from "react";

// A stylized, minimalist Lady Justice SVG symbol, inspired by the classic pose.
const LadyJusticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 98 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Lady Justice Symbol"
  >
    {/* Head */}
    <circle cx="49" cy="22" r="10" fill="#e7eafc" stroke="#4852B7" strokeWidth="2"/>
    {/* Body */}
    <rect x="43" y="32" width="12" height="32" rx="6" fill="#e7eafc" stroke="#4852B7" strokeWidth="2"/>
    {/* Right Arm (scales) */}
    <path d="M55 40 Q75 55 85 45" stroke="#4852B7" strokeWidth="3" fill="none"/>
    {/* Left Arm (sword) */}
    <path d="M43 40 Q25 58 12 53" stroke="#4852B7" strokeWidth="3" fill="none"/>
    {/* Scales: right */}
    <line x1="85" y1="45" x2="85" y2="60" stroke="#4852B7" strokeWidth="2"/>
    <ellipse cx="85" cy="63" rx="6" ry="3" fill="#e7eafc" stroke="#4852B7" strokeWidth="1"/>
    {/* Sword: left */}
    <rect x="9.5" y="52" width="2" height="18" rx="1" fill="#4852B7"/>
    <polygon points="8,70 13,70 10.5,76" fill="#4852B7"/>
    {/* Lower body/skirt */}
    <path d="M48,64 Q50,94 25,134 Q49,126 73,134 Q48,94 50,64" fill="#e7eafc" stroke="#4852B7" strokeWidth="2"/>
    {/* Blindfold */}
    <rect x="40" y="20" width="18" height="6" rx="3" fill="#4852B7" fillOpacity="0.70"/>
  </svg>
);

export default LadyJusticeIcon;
