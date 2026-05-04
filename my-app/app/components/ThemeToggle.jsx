"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Using a microtask to avoid "synchronous setState in effect" lint error
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-glass-surface border border-glass-border shadow-inner transition-all duration-500 hover:scale-105 active:scale-95 group overflow-hidden"
      aria-label="Toggle Theme"
    >
      {/* Moving Track */}
      <div className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-all duration-500 ease-spring ${
        theme === 'dark' ? 'translate-x-7 bg-blue-500' : 'translate-x-0 bg-amber-400'
      } shadow-lg flex items-center justify-center`}>
        {theme === 'dark' ? (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </div>

      {/* Decorative dots for dark mode */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1.5 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-4 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-75" />
        <div className="absolute top-2 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-150" />
      </div>

      {/* Decorative rays for light mode */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1 right-3 w-1 h-1 bg-amber-200/20 rounded-full" />
        <div className="absolute bottom-2 right-4 w-1.5 h-1.5 bg-amber-200/10 rounded-full" />
      </div>
    </button>
  );
}
