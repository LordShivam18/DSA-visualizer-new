"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";

const problems = [
  { name: "Cycle Detection (Floyd's)", url: "/linked-list/cycle", difficulty: "easy" as const, description: "Detect a cycle using slow and fast pointers" },
  { name: "Add Two Numbers", url: "/linked-list/add-two-numbers", difficulty: "medium" as const, description: "Add numbers represented as linked lists" },
  { name: "Merge Two Sorted Lists", url: "/linked-list/merge-two-sorted-lists", difficulty: "easy" as const, description: "Merge two sorted linked lists into one" },
  { name: "Reverse Nodes in k-Group", url: "/linked-list/reverse-k-group", difficulty: "hard" as const, description: "Reverse nodes in groups of k" },
  { name: "Remove Nth from End", url: "/linked-list/remove-nth", difficulty: "medium" as const, description: "Remove the nth node from end of list" },
  { name: "Remove Duplicates II", url: "/linked-list/remove-duplicates-ii", difficulty: "medium" as const, description: "Remove all nodes with duplicate values" },
  { name: "Reverse Linked List II", url: "/linked-list/reverse-linked-list-ii", difficulty: "medium" as const, description: "Reverse a portion of the linked list" },
  { name: "Rotate List", url: "/linked-list/rotate-list", difficulty: "medium" as const, description: "Rotate the list to the right by k" },
  { name: "LRU Cache", url: "/linked-list/lru-cache", difficulty: "medium" as const, description: "Design a Least Recently Used cache" },
];

const diffColors = {
  easy: { badge: "badge-easy", glow: "hover:shadow-[0_0_25px_rgba(52,211,153,0.15)]", border: "border-emerald-500/20 hover:border-emerald-500/40" },
  medium: { badge: "badge-medium", glow: "hover:shadow-[0_0_25px_rgba(251,191,36,0.15)]", border: "border-amber-500/20 hover:border-amber-500/40" },
  hard: { badge: "badge-hard", glow: "hover:shadow-[0_0_25px_rgba(251,113,133,0.15)]", border: "border-rose-500/20 hover:border-rose-500/40" },
};

export default function LinkedListTopics() {
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
            <span className="text-violet-400 text-glow-violet">Linked List</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Pointer-based data structure problems — choose a problem to visualize
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
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={{ x: 6 }}
                  className={`glass-card p-5 flex items-center gap-4 border ${dc.border} ${dc.glow} transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-100 group-hover:text-violet-300 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${dc.badge}`}>
                    {p.difficulty}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="text-slate-600 group-hover:text-violet-400 transition-colors flex-shrink-0">
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
