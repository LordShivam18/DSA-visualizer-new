import type { Metadata } from "next";
import "./globals.css";
import { LearningPlatformProvider } from "@/components/academy/LearningPlatformProvider";

export const metadata: Metadata = {
  title: "Guided DSA Academy - Deep Lessons, Replay Variations, and Daily Practice",
  description:
    "A free guided DSA learning platform built on trace-driven visualizers, with why panels, mistake detection, guided paths, replay variations, pattern coaching, and adaptive progress tracking.",
  keywords: [
    "DSA",
    "data structures",
    "algorithms",
    "learning platform",
    "interview prep",
    "algorithm practice",
    "prediction mode",
    "guided learning",
    "algorithm visualizer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LearningPlatformProvider>{children}</LearningPlatformProvider>
      </body>
    </html>
  );
}
