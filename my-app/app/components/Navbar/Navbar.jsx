"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Post a Job", href: "/post_job" },
  ];

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 tracking-tight"
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
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600 transition-colors"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ✅ Auth Buttons */}
        <div className="space-x-3 flex items-center">
          <Link
            href="/login"
            className="text-blue-600 border border-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-50 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
