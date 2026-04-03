"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <Link href={href}>
      <motion.button
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                   bg-slate-900/60 border border-slate-700/50 text-slate-300
                   hover:text-cyan-300 hover:border-cyan-500/30
                   transition-colors duration-200"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-current"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </motion.button>
    </Link>
  );
}
