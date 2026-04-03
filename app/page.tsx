"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ParticleBackground from "@/components/ui/ParticleBackground";

const features = [
  {
    icon: "🎬",
    title: "Visualize",
    desc: "Watch algorithms execute step-by-step with stunning neon animations",
    color: "#22d3ee",
  },
  {
    icon: "🧠",
    title: "Learn",
    desc: "Beginner & expert modes with code mapping and detailed explanations",
    color: "#a78bfa",
  },
  {
    icon: "⚡",
    title: "Practice",
    desc: "Input your own test cases and see the algorithm process your data",
    color: "#34d399",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      <ParticleBackground density={70} />

      {/* Decorative background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-violet-500/5 blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/3 blur-[160px] pointer-events-none" />

      {/* Hero section */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase
                     bg-cyan-500/8 border border-cyan-500/20 text-cyan-300"
        >
          Interactive Algorithm Visualizer
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight"
        >
          <span className="gradient-text-hero">DSA</span>
          <br />
          <span className="text-white">Visualizer</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed"
        >
          Understand Data Structures & Algorithms through{" "}
          <span className="text-cyan-300 font-medium">beautiful animations</span>,{" "}
          <span className="text-violet-300 font-medium">step-by-step traces</span>, and{" "}
          <span className="text-emerald-300 font-medium">custom inputs</span>.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 flex gap-4"
        >
          <Link href="/topics">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-2xl text-lg font-bold
                         bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500
                         text-white shadow-[0_0_40px_rgba(34,211,238,0.4)]
                         hover:shadow-[0_0_60px_rgba(34,211,238,0.6)]
                         transition-shadow duration-300"
            >
              Explore Topics →
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full"
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
              className="glass-card p-6 text-center group"
              style={{
                borderColor: `${feat.color}22`,
              }}
            >
              <div className="text-4xl mb-3">{feat.icon}</div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: feat.color }}
              >
                {feat.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-14 flex gap-10 text-center"
        >
          {[
            { value: "7+", label: "Topics" },
            { value: "20+", label: "Problems" },
            { value: "∞", label: "Custom Inputs" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-extrabold gradient-text-hero">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
