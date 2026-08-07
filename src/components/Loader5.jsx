import { useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function AboutRevealLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        overflow-hidden
        bg-[#F5F0E5]
      "
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.025,
        filter: "blur(4px)",
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="
          absolute
          h-[520px] w-[520px]
          rounded-full
          bg-[#244C35]/5
          blur-[110px]
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <motion.div
        className="
          absolute
          h-[340px] w-[340px]
          rounded-full
          border border-[#244C35]/5
        "
        initial={{
          scale: 0.6,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 1.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          className="mb-7 flex items-center gap-3"
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
            duration: 0.6,
          }}
        >
          <motion.span
            className="h-px bg-[#B4975A]"
            initial={{ width: 0 }}
            animate={{ width: 28 }}
            transition={{
              delay: 0.45,
              duration: 0.5,
            }}
          />

          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.45em]
              text-[#B4975A]
            "
          >
            Est.
          </span>

          <motion.span
            className="h-px bg-[#B4975A]"
            initial={{ width: 0 }}
            animate={{ width: 28 }}
            transition={{
              delay: 0.45,
              duration: 0.5,
            }}
          />
        </motion.div>

        <div
          className="
            relative
            flex h-40 w-40
            items-center justify-center
          "
        >
          <svg
            viewBox="0 0 200 200"
            className="
              absolute inset-0
              h-full w-full
              -rotate-90
            "
          >
            <motion.circle
              cx="100"
              cy="100"
              r="87"
              fill="none"
              stroke="#B4975A"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{
                pathLength: 0,
                opacity: 0,
              }}
              animate={{
                pathLength: 1,
                opacity: 0.65,
              }}
              transition={{
                duration: 1.1,
                ease: "easeInOut",
              }}
            />

            <motion.circle
              cx="100"
              cy="100"
              r="79"
              fill="none"
              stroke="#244C35"
              strokeWidth="0.5"
              initial={{
                pathLength: 0,
                opacity: 0,
              }}
              animate={{
                pathLength: 1,
                opacity: 0.15,
              }}
              transition={{
                delay: 0.15,
                duration: 1.2,
              }}
            />
          </svg>

          <motion.div
            className="
              absolute
              right-[8px]
              top-[15px]
              z-20
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-[#F5F0E5]
            "
            initial={{
              opacity: 0,
              scale: 0,
              rotate: -35,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 12,
            }}
            transition={{
              delay: 0.75,
              duration: 0.6,
              type: "spring",
              stiffness: 120,
            }}
          >
            <Leaf size={20} strokeWidth={1.3} className="text-[#315C3B]" />
          </motion.div>

          <div className="relative flex items-center justify-center">
            <motion.span
              className="
                relative z-10
                font-serif
                text-[68px]
                font-light
                leading-none
                text-[#244C35]
              "
              initial={{
                opacity: 0,
                x: -25,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                x: 7,
                filter: "blur(0px)",
              }}
              transition={{
                delay: 0.45,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              G
            </motion.span>

            <motion.span
              className="
                relative z-20
                -ml-4
                font-serif
                text-[72px]
                font-light
                italic
                leading-none
                text-[#B4975A]
              "
              initial={{
                opacity: 0,
                x: 25,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                x: -7,
                filter: "blur(0px)",
              }}
              transition={{
                delay: 0.58,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              V
            </motion.span>
          </div>
        </div>

        <motion.h1
          className="
            mt-7
            font-serif
            text-[22px]
            font-medium
            tracking-[0.3em]
            text-[#244C35]
          "
          initial={{
            opacity: 0,
            y: 12,
            letterSpacing: "0.48em",
          }}
          animate={{
            opacity: 1,
            y: 0,
            letterSpacing: "0.3em",
          }}
          transition={{
            delay: 1,
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          GREEN VALLEY
        </motion.h1>

        <motion.p
          className="
            mt-2
            text-[8px]
            uppercase
            tracking-[0.55em]
            text-[#B4975A]
          "
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.25,
            duration: 0.5,
          }}
        >
          Food One
        </motion.p>

        <motion.div
          className="
            my-6
            h-px
            bg-[#B4975A]
          "
          initial={{
            width: 0,
            opacity: 0,
          }}
          animate={{
            width: 85,
            opacity: 0.65,
          }}
          transition={{
            delay: 1.4,
            duration: 0.7,
          }}
        />

        <motion.div className="overflow-hidden">
          <motion.h2
            className="
              font-serif
              text-[13px]
              italic
              tracking-[0.18em]
              text-[#244C35]/65
            "
            initial={{
              y: 25,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              delay: 1.55,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Our Story
          </motion.h2>
        </motion.div>

        <div
          className="
            mt-9
            h-[1px] w-36
            overflow-hidden
            bg-[#244C35]/10
          "
        >
          <motion.div
            className="h-full bg-[#B4975A]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              delay: 0.3,
              duration: 1.9,
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        </div>
      </div>

      <motion.div
        className="
          pointer-events-none
          absolute
          left-1/2 top-1/2
          h-20 w-20
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border border-[#B4975A]/20
        "
        initial={{
          scale: 1,
          opacity: 0,
        }}
        animate={{
          scale: [1, 1, 15],
          opacity: [0, 0, 0.3],
        }}
        transition={{
          duration: 2.5,
          times: [0, 0.78, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </motion.div>
  );
}
