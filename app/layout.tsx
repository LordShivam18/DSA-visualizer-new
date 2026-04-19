import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA Visualizer - Understand Algorithms Through Animation",
  description:
    "Interactive visual explanations of data structures and algorithms. Step through problems like linked lists, binary trees, stacks, and more with beautiful animations.",
  keywords: [
    "DSA",
    "data structures",
    "algorithms",
    "visualizer",
    "binary tree",
    "linked list",
    "stack",
    "two pointers",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
