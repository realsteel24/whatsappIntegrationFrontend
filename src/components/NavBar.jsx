// components/NavBar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path) =>
    `block px-4 py-2 rounded-md transition ${
      location.pathname === path
        ? "bg-green-700 text-white"
        : "text-zinc-300 hover:text-white hover:bg-zinc-800"
    }`;

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-green-500 tracking-wide">
          Kwality Kids and Sports
        </div>
        <button
          className="md:hidden text-zinc-300 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
        <div className="hidden md:flex gap-4">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/bulk-message" className={linkClass("/bulk-message")}>
            Bulk Message
          </Link>
          <Link to="/chat" className={linkClass("/chat")}>
            Chat
          </Link>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2">
          <Link
            to="/dashboard"
            className={linkClass("/dashboard")}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/bulk-message"
            className={linkClass("/bulk-message")}
            onClick={() => setMenuOpen(false)}
          >
            Bulk Message
          </Link>
          <Link
            to="/chat"
            className={linkClass("/chat")}
            onClick={() => setMenuOpen(false)}
          >
            Chat
          </Link>
        </div>
      )}
    </nav>
  );
}
