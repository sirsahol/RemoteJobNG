"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isEmployer, isAdmin, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "PROTOCOL", href: "/jobs" },
    { name: "BROADCAST", href: "/post_job" },
    { name: "PRICING", href: "/pricing" },
    { name: "VISION", href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    if (isAuthenticated) {
      api.get("/notifications/unread-count/")
        .then(res => setUnreadCount(res.data.unread_count))
        .catch(() => {});
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthenticated]);

  const dashboardHref = isEmployer ? "/dashboard/employer" : "/dashboard/seeker";

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 px-4 md:px-8 ${scrolled ? 'py-4' : 'py-8'}`}>
      <nav className={`max-w-7xl mx-auto glass-card border-white/10 px-6 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-2xl shadow-blue-500/10 bg-white/[0.03]' : ''}`}>
        {/* Technical Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-xl group-hover:rotate-[15deg] transition-all duration-500 flex items-center justify-center text-white font-black text-lg">
            R
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            RemoteJob<span className="text-blue-500">NG</span>
          </span>
        </Link>

        {/* Global Navigation Protocol */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${
                pathname === link.href
                  ? "bg-blue-600/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] border border-blue-500/20"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth & System Status */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-6 pr-6 border-r border-white/5">
                  <Link
                    href={dashboardHref}
                    className={`text-[10px] font-black tracking-[0.2em] transition-all ${
                      pathname.startsWith("/dashboard") ? "text-blue-400" : "text-white/40 hover:text-white"
                    }`}
                  >
                    COMMAND
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin/verification"
                      className={`text-[10px] font-black tracking-[0.2em] transition-all ${
                        pathname.startsWith("/admin") ? "text-indigo-400" : "text-white/40 hover:text-white"
                      }`}
                    >
                      CENTRAL
                    </Link>
                  )}

                  <div className="relative group">
                    <Link href="/notifications" className="text-white/40 hover:text-white transition-all block">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-[#0a0c10] shadow-lg shadow-blue-500/40">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  </div>
              </div>

              <button
                onClick={logout}
                className="text-white/20 hover:text-red-500 text-[10px] font-black tracking-[0.2em] transition-all"
              >
                EXIT
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-white/40 hover:text-white px-4 py-2 text-[10px] font-black tracking-[0.2em] transition-all"
              >
                ACCESS
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95"
              >
                ESTABLISH
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
