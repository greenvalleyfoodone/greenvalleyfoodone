import { useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee, UtensilsCrossed, Leaf } from "lucide-react";

const icons = [
  {
    id: 1,
    Icon: Coffee,
    title: "CAFÉ",
    subtitle: "Freshly Brewed",
  },
  {
    id: 2,
    Icon: UtensilsCrossed,
    title: "RESTAURANT",
    subtitle: "Made With Care",
  },
  {
    id: 3,
    Icon: Leaf,
    title: "GREEN VALLEY",
    subtitle: "Food One",
  },
];

export default function IconSequenceLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        overflow-hidden
        bg-[#F6F2E8]
      "
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: "blur(6px)",
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="
          absolute
          h-[450px] w-[450px]
          rounded-full
          bg-[#244C35]/5
          blur-[100px]
        "
      />

      <div className="relative flex flex-col items-center">
        <div className="relative h-32 w-32">
          {icons.map(({ id, Icon }, index) => {
            const delay = index * 1;

            return (
              <motion.div
                key={id}
                className="
                  absolute inset-0
                  flex items-center justify-center
                "
                initial={{
                  opacity: 0,
                  scale: 0.6,
                  y: 15,
                  rotate: -8,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.6, 1, 1, 1.15],
                  y: [15, 0, 0, -10],
                  rotate: [-8, 0, 0, 5],
                }}
                transition={{
                  duration: 1,
                  delay,
                  times: [0, 0.25, 0.7, 1],
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="
                    relative
                    flex h-24 w-24
                    items-center justify-center
                    rounded-full
                    border border-[#B89B5E]/30
                    bg-white/80
                    shadow-[0_20px_50px_rgba(36,76,53,0.12)]
                    backdrop-blur-sm
                  "
                >
                  <motion.div
                    className="
                      absolute inset-[-8px]
                      rounded-full
                      border border-[#244C35]/10
                    "
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 1] }}
                    transition={{
                      delay,
                      duration: 0.7,
                    }}
                  />

                  <Icon size={40} strokeWidth={1.4} className="text-[#244C35]" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="relative mt-5 h-16 w-72 text-center">
          {icons.map(({ id, title, subtitle }, index) => {
            const delay = index * 1;

            return (
              <motion.div
                key={id}
                className="absolute inset-0"
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [10, 0, 0, -8],
                }}
                transition={{
                  duration: 1,
                  delay,
                  times: [0, 0.25, 0.7, 1],
                }}
              >
                <h2
                  className="
                    font-serif
                    text-lg
                    font-semibold
                    tracking-[0.22em]
                    text-[#244C35]
                  "
                >
                  {title}
                </h2>

                <p
                  className="
                    mt-2
                    text-[9px]
                    uppercase
                    tracking-[0.35em]
                    text-[#A48852]
                  "
                >
                  {subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-7 flex items-center gap-3">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="
                h-[5px] w-[5px]
                rounded-full
                bg-[#244C35]
              "
              initial={{
                opacity: 0.15,
                scale: 1,
              }}
              animate={{
                opacity: [0.15, 1, 0.15],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1,
                delay: index,
              }}
            />
          ))}
        </div>

        <div
          className="
            mt-7
            h-[1px] w-32
            overflow-hidden
            bg-[#244C35]/10
          "
        >
          <motion.div
            className="h-full bg-[#B89B5E]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      <motion.div
        className="
          absolute
          flex flex-col
          items-center
        "
        initial={{
          opacity: 0,
          scale: 0.85,
        }}
        animate={{
          opacity: [0, 0, 0, 1],
          scale: [0.85, 0.85, 0.85, 1],
        }}
        transition={{
          duration: 3.4,
          times: [0, 0.75, 0.87, 1],
        }}
      >
        <img
          src="/images/logo.png"
          alt="Green Valley Food One"
          className="h-28 w-28 object-contain"
        />

        <motion.p
          className="
            mt-4
            font-serif
            text-xl
            font-semibold
            tracking-[0.2em]
            text-[#244C35]
          "
        >
          GREEN VALLEY
        </motion.p>

        <p
          className="
            mt-2
            text-[9px]
            uppercase
            tracking-[0.45em]
            text-[#A48852]
          "
        >
          Food One
        </p>
      </motion.div>
    </motion.div>
  );
}
