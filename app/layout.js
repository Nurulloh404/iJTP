import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Glow Habits — Modern Habit Tracker",
  description:
    "A dark, glassmorphism-inspired habit tracker with smooth micro-interactions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#05060a] text-slate-100 selection:bg-emerald-500/40 selection:text-emerald-50`}
      >
        {children}
      </body>
    </html>
  );
}
