"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, isEmployer, isSeeker, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-800">Remote</span>
          <span className="text-xl font-bold text-gray-900">WorkNaija</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/jobs" className="text-gray-600 hover:text-green-800 font-medium transition">Find Jobs</Link>
          <Link href="/about" className="text-gray-600 hover:text-green-800 transition">About</Link>
          {isAuthenticated ? (
            <>
              {isEmployer && (
                <>
                  <Link href="/jobs/post" className="text-gray-600 hover:text-green-800 transition">Post a Job</Link>
                  <Link href="/dashboard/employer" className="text-gray-600 hover:text-green-800 font-medium transition">Dashboard</Link>
                </>
              )}
              {isSeeker && (
                <Link href="/dashboard/seeker" className="text-gray-600 hover:text-green-800 font-medium transition">Dashboard</Link>
              )}
              <button onClick={logout} className="text-gray-600 hover:text-red-600 transition">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-green-800 transition font-medium">Log In</Link>
              <Link href="/signup" className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`w-5 h-0.5 bg-gray-700 mb-1 transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <div className={`w-5 h-0.5 bg-gray-700 mb-1 ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-gray-700 transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/jobs" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Find Jobs</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="text-gray-600">About</Link>
          {isAuthenticated ? (
            <>
              {isEmployer && <Link href="/dashboard/employer" onClick={() => setMenuOpen(false)} className="text-gray-700">Dashboard</Link>}
              {isSeeker && <Link href="/dashboard/seeker" onClick={() => setMenuOpen(false)} className="text-gray-700">Dashboard</Link>}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-red-500 text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-gray-700">Log In</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="bg-green-700 text-white px-4 py-2 rounded-lg text-center font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
