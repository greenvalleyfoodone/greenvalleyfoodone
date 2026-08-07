import { useEffect } from "react";
import { motion } from "framer-motion";

export default function ClocheRevealLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F7F3EA]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="relative flex flex-col items-center">
        <div className="absolute -top-20 flex gap-5">
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              className="block h-12 w-[3px] rounded-full bg-[#315C3B]/30"
              initial={{ opacity: 0, y: 20, scaleY: 0.5 }}
              animate={{
                opacity: [0, 0.7, 0],
                y: [20, -20, -40],
                x: [0, item === 1 ? 5 : -5, 0],
                scaleY: [0.5, 1, 1.2],
              }}
              transition={{
                duration: 1.5,
                delay: 0.3 + item * 0.15,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        <motion.div
          className="absolute top-8 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.05, duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#315C3B]/20 bg-white shadow-xl">
            <span className="text-5xl">🍽️</span>
          </div>

          <motion.h2
            className="mt-5 whitespace-nowrap font-serif text-xl font-semibold tracking-[0.18em] text-[#315C3B]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            GREEN VALLEY
          </motion.h2>

          <motion.p
            className="mt-1 text-[10px] uppercase tracking-[0.35em] text-[#315C3B]/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            Food One
          </motion.p>
        </motion.div>

        <motion.div
          className="relative z-20"
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: [-120, 0, 0, -150], opacity: [0, 1, 1, 1], rotate: [0, 0, 0, -4] }}
          transition={{ duration: 1.7, times: [0, 0.3, 0.55, 1], ease: ["easeOut", "linear", "easeInOut"] }}
        >
          <div className="mx-auto h-5 w-10 rounded-t-full border-[3px] border-[#315C3B] border-b-0" />

          <div
            className="h-28 w-64 rounded-t-[150px] border-[3px] border-[#315C3B] bg-gradient-to-b from-[#FDFCF8] via-[#E8E5DC] to-[#CAC7BE] shadow-[inset_10px_8px_20px_rgba(255,255,255,0.8),0_12px_30px_rgba(0,0,0,0.12)]"
          >
            <div className="ml-12 mt-5 h-14 w-5 rotate-[25deg] rounded-full bg-white/40 blur-sm" />
          </div>

          <div className="-mt-[2px] h-[7px] w-72 -translate-x-4 rounded-full bg-[#315C3B] shadow-md" />
        </motion.div>

        <motion.div
          className="relative z-10 -mt-1"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-3 w-72 rounded-[50%] border-2 border-[#315C3B]/50 bg-white shadow-lg" />
          <div className="mx-auto h-2 w-52 rounded-b-full bg-[#315C3B]/15" />
        </motion.div>

        <motion.p
          className="mt-12 text-[10px] uppercase tracking-[0.4em] text-[#315C3B]/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8 }}
        >
          Preparing your experience
        </motion.p>
      </div>
    </motion.div>
  );
}