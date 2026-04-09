"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isEmployer, isSeeker, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const links = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Post a Job", href: "/post_job" },
  ];

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get("/notifications/unread-count/")
      .then(res => setUnreadCount(res.data.unread_count))
      .catch(() => {});
  }, [isAuthenticated]);

  const dashboardHref = isEmployer ? "/dashboard/employer" : "/dashboard/seeker";

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-green-700 tracking-tight"
        >
          Remote<span className="text-gray-800">JobsNG</span>
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 hidden md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`font-medium ${
                pathname === link.href
                  ? "text-green-700"
                  : "text-gray-700 hover:text-green-700 transition-colors"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="space-x-3 flex items-center">
          {isAuthenticated ? (
            <>
              {/* Dashboard link based on role */}
              <Link
                href={dashboardHref}
                className={`font-medium text-sm ${
                  pathname.startsWith("/dashboard")
                    ? "text-green-700"
                    : "text-gray-700 hover:text-green-700 transition-colors"
                }`}
              >
                Dashboard
              </Link>

              {/* Notification bell with unread count */}
              <div className="relative">
                <Link href="/notifications" className="text-gray-600 hover:text-green-800 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="text-red-500 border border-red-500 px-4 py-2 rounded-xl font-medium hover:bg-red-50 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-green-700 border border-green-700 px-4 py-2 rounded-xl font-medium hover:bg-green-50 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-green-700 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-800 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
