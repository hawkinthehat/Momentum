"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Intro() {
  const router = useRouter();

  const script = [
    "Welcome to a quiet space.",
    "No noise. No pressure.",
    "Just you, the pack, and small wins.",
    "Let's start by finding your center.",
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFCF8] p-8 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="space-y-12"
      >
        <p className="text-xl font-serif italic text-slate-500">{script[0]}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="rounded-full bg-emerald-500 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-100"
        >
          Enter Sanctuary
        </motion.button>
      </motion.div>
    </div>
  );
}
