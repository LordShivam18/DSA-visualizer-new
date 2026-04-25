import type { Metadata } from "next";
import "./globals.css";
import { LearningPlatformProvider } from "@/components/academy/LearningPlatformProvider";

export const metadata: Metadata = {
  title: "Guided DSA Academy - Prediction, Practice, and Interview Modes",
  description:
    "A production-ready DSA learning platform built on trace-driven visualizers, with prediction checkpoints, practice labs, interview simulations, adaptive recommendations, and persistent progress tracking.",
  keywords: [
    "DSA",
    "data structures",
    "algorithms",
    "learning platform",
    "interview prep",
    "algorithm practice",
    "prediction mode",
    "coding interview simulator",
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
