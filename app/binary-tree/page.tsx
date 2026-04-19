"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";

const problems = [
  { name: "Maximum Depth", url: "/binary-tree/max-depth", difficulty: "easy" as const, description: "Find the maximum depth of a binary tree" },
  { name: "Same Tree", url: "/binary-tree/same-tree", difficulty: "easy" as const, description: "Check if two binary trees are identical" },
  { name: "Invert Binary Tree", url: "/binary-tree/invert-tree", difficulty: "easy" as const, description: "Mirror a binary tree" },
  { name: "Symmetric Tree", url: "/binary-tree/symmetric-tree", difficulty: "easy" as const, description: "Check if tree is a mirror of itself" },
  { name: "Populate Next Right Pointers II", url: "/binary-tree/populating-next-right-pointers-ii", difficulty: "medium" as const, description: "Connect each level with in-place next pointers" },
  { name: "Construct from Preorder + Inorder", url: "/binary-tree/construct-from-pre-in", difficulty: "medium" as const, description: "Build tree from traversal arrays" },
];

const diffColors = {
  easy: { badge: "badge-easy", glow: "hover:shadow-[0_0_25px_rgba(52,211,153,0.15)]", border: "border-emerald-500/20 hover:border-emerald-500/40" },
  medium: { badge: "badge-medium", glow: "hover:shadow-[0_0_25px_rgba(251,191,36,0.15)]", border: "border-amber-500/20 hover:border-amber-500/40" },
  hard: { badge: "badge-hard", glow: "hover:shadow-[0_0_25px_rgba(251,113,133,0.15)]", border: "border-rose-500/20 hover:border-rose-500/40" },
};

export default function BinaryTreeTopics() {
  return (
    <div className="min-h-screen grid-pattern px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <BackButton href="/topics" label="Topics" />

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-emerald-400" style={{ textShadow: "0 0 18px rgba(52,211,153,0.8)" }}>Binary Tree</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Tree traversal and structure problems — choose a problem to visualize
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {problems.map((p, i) => {
            const dc = diffColors[p.difficulty];
            return (
              <Link key={p.url} href={p.url}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ x: 6 }}
                  className={`glass-card p-5 flex items-center gap-4 border ${dc.border} ${dc.glow} transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${dc.badge}`}>
                    {p.difficulty}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="text-slate-600 group-hover:text-emerald-400 transition-colors flex-shrink-0">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
