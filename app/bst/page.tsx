"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import BackButton from "../../components/ui/BackButton";

const problems = [
  {
    name: "Minimum Absolute Difference in BST",
    url: "/bst/minimum-absolute-difference-in-bst",
    difficulty: "easy" as const,
    description:
      "Use inorder traversal to compare adjacent sorted BST values and keep the smallest gap.",
  },
  {
    name: "Kth Smallest Element in a BST",
    url: "/bst/kth-smallest-element-in-a-bst",
    difficulty: "medium" as const,
    description:
      "Walk the BST in sorted inorder order and stop when the rank counter reaches k.",
  },
  {
    name: "Validate Binary Search Tree",
    url: "/bst/validate-binary-search-tree",
    difficulty: "medium" as const,
    description:
      "Propagate strict lower and upper bounds so every node obeys all ancestor constraints.",
  },
];

const diffColors = {
  easy: {
    badge: "badge-easy",
    glow: "hover:shadow-[0_0_25px_rgba(52,211,153,0.15)]",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
  },
  medium: {
    badge: "badge-medium",
    glow: "hover:shadow-[0_0_25px_rgba(251,191,36,0.15)]",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
  hard: {
    badge: "badge-hard",
    glow: "hover:shadow-[0_0_25px_rgba(251,113,133,0.15)]",
    border: "border-rose-500/20 hover:border-rose-500/40",
  },
};

export default function BSTTopics() {
  return (
    <div className="min-h-screen grid-pattern px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <BackButton href="/topics" label="Topics" />

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 mt-6"
        >
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            <span
              className="text-amber-400"
              style={{ textShadow: "0 0 18px rgba(251,191,36,0.75)" }}
            >
              Binary Search Tree
            </span>
          </h1>
          <p className="mt-2 text-slate-400">
            Sorted tree invariants, inorder traversal, rank queries, and strict bound checks.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {problems.map((problem, index) => {
            const colors = diffColors[problem.difficulty];

            return (
              <Link key={problem.url} href={problem.url}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  whileHover={{ x: 6 }}
                  className={`glass-card flex cursor-pointer items-center gap-4 border p-5 transition-all duration-300 group ${colors.border} ${colors.glow}`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-100 transition-colors group-hover:text-amber-300">
                      {problem.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {problem.description}
                    </p>
                  </div>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${colors.badge}`}
                  >
                    {problem.difficulty}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 text-slate-600 transition-colors group-hover:text-amber-400"
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
