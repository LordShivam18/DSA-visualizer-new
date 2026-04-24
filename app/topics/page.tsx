"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import BackButton from "@/components/ui/BackButton";
import ParticleBackground from "@/components/ui/ParticleBackground";

const topics = [
  { name: "Array / String", url: "/array-string", icon: "ARR", accent: "cyan", count: 12 },
  { name: "Two Pointers", url: "/two-pointers", icon: "2P", accent: "violet", count: 5 },
  { name: "Sliding Window", url: "/sliding-window", icon: "WIN", accent: "emerald", count: 4 },
  { name: "Matrix", url: "/matrix", icon: "MAT", accent: "amber", count: 0 },
  { name: "Hashmap", url: "/hashmap", icon: "MAP", accent: "blue", count: 9 },
  { name: "Intervals", url: "/intervals", icon: "INT", accent: "rose", count: 0 },
  { name: "Stack", url: "/stack", icon: "STK", accent: "cyan", count: 1 },
  { name: "Linked List", url: "/linked-list", icon: "LL", accent: "violet", count: 9 },
  { name: "Binary Tree (General)", url: "/binary-tree", icon: "TREE", accent: "emerald", count: 11 },
  { name: "Binary Tree BFS", url: "/binary-tree-bfs", icon: "BFS", accent: "blue", count: 2 },
  { name: "Binary Search Tree", url: "/bst", icon: "BST", accent: "amber", count: 3 },
  { name: "Graph Traversal", url: "/graph-traversal", icon: "GRT", accent: "rose", count: 6 },
  { name: "Graph BFS", url: "/graph-bfs", icon: "GBFS", accent: "cyan", count: 3 },
  { name: "Trie", url: "/trie", icon: "TRIE", accent: "violet", count: 0 },
  { name: "Backtracking", url: "/backtracking", icon: "BT", accent: "emerald", count: 7 },
  { name: "Divide & Conquer", url: "/divide-conquer", icon: "D&C", accent: "amber", count: 4 },
  { name: "Kadane's Algorithm", url: "/kadane", icon: "KAD", accent: "cyan", count: 1 },
  { name: "Binary Search", url: "/binary-search", icon: "BS", accent: "rose", count: 7 },
  { name: "Heap", url: "/heap", icon: "HEAP", accent: "blue", count: 4 },
  { name: "Bit Manipulation", url: "/bit", icon: "BIT", accent: "violet", count: 0 },
  { name: "Math", url: "/math", icon: "MATH", accent: "emerald", count: 2 },
  { name: "1D DP", url: "/dp-1d", icon: "DP1", accent: "amber", count: 0 },
  { name: "Multidimensional DP", url: "/dp-2d", icon: "DP2", accent: "rose", count: 0 },
] as const;

const accentColors: Record<string, { text: string; border: string; glow: string; bg: string }> = {
  cyan: {
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
    bg: "bg-cyan-500/8",
  },
  violet: {
    text: "text-violet-400",
    border: "border-violet-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]",
    bg: "bg-violet-500/8",
  },
  emerald: {
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]",
    bg: "bg-emerald-500/8",
  },
  amber: {
    text: "text-amber-400",
    border: "border-amber-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]",
    bg: "bg-amber-500/8",
  },
  blue: {
    text: "text-blue-400",
    border: "border-blue-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]",
    bg: "bg-blue-500/8",
  },
  rose: {
    text: "text-rose-400",
    border: "border-rose-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(251,113,133,0.15)]",
    bg: "bg-rose-500/8",
  },
};

export default function Topics() {
  return (
    <div className="relative min-h-screen grid-pattern">
      <ParticleBackground density={35} speed={0.25} color="167, 139, 250" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-4">
          <BackButton href="/" label="Home" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="gradient-text-hero">Choose a Topic</span>
          </h1>
          <p className="mt-3 text-slate-400 text-lg">
            Select a data structure or algorithm category to explore
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topics.map((topic, i) => {
            const colors = accentColors[topic.accent] || accentColors.cyan;

            return (
              <Link key={topic.url} href={topic.url}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`group glass-card p-5 flex items-center gap-4 border ${colors.border} ${colors.glow} transition-all duration-300 cursor-pointer`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold tracking-[0.18em] ${colors.bg}`}
                  >
                    {topic.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-sm ${colors.text} group-hover:brightness-125 transition-all truncate`}
                    >
                      {topic.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {topic.count > 0
                        ? `${topic.count} problem${topic.count > 1 ? "s" : ""}`
                        : "Coming soon"}
                    </p>
                  </div>

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-slate-600 group-hover:text-slate-300 transition-colors flex-shrink-0"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
