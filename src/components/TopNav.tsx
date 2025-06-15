
import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

const TopNav: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="fixed top-0 left-0 w-full z-30 flex items-center justify-between px-6 md:px-10 h-14 bg-black/25 backdrop-blur border-b border-white/10">
      <div className="text-xl font-extrabold text-white font-serif tracking-wide">
        LegalOps
      </div>
      <ul className="flex gap-6">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={
                "px-2 py-1 text-white/80 hover:text-white font-medium transition " +
                (location.pathname === item.to ? "underline text-white" : "")
              }
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TopNav;
