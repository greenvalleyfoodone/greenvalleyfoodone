"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function RestaurantLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c1810]"
    >
      <div className="text-center text-white">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-5"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d4a574] text-4xl">
            🍛
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-display text-3xl"
        >
          Green Valley
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-[#d4a574]"
        >
          Authentic Andhra flavours
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1.1 }}
          className="mx-auto mt-7 h-1 max-w-[180px] rounded-full bg-[#d4a574]"
        />
      </div>
    </motion.div>
  );
}