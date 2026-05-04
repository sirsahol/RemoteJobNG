import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar/Navbar";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

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
    default: "RemoteJobNG — Premier Global Talent Protocol for Nigerians",
    template: "%s | RemoteJobNG",
  },
  description: "The authoritative gateway for Nigerian technical excellence. Access high-tier global remote opportunities from companies that value professional integrity and skill.",
  keywords: ["RemoteJobNG", "remote jobs Nigeria", "work from home Nigeria", "Nigerian remote work", "global jobs Nigeria", "international jobs Nigeria"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-blue-500/30 transition-colors duration-500`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="relative z-10">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
