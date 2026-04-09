import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar/Navbar";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://remoteworknaija.com"),
  title: {
    default: "RemoteWorkNaija — Global Remote Jobs for Nigerians",
    template: "%s | RemoteWorkNaija",
  },
  description: "Find global remote jobs tailored for Nigerian professionals. Work from anywhere for top international companies.",
  keywords: ["remote jobs Nigeria", "work from home Nigeria", "Nigerian remote work", "global jobs Nigeria", "international jobs Nigeria"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://remoteworknaija.com",
    siteName: "RemoteWorkNaija",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "RemoteWorkNaija" }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@remoteworknaija",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
