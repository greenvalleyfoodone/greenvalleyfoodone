import { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function ContactDropLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        overflow-hidden
        bg-[#F5F0E6]
      "
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: "blur(3px)",
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="
          absolute
          h-[500px] w-[500px]
          rounded-full
          bg-[#244C35]/5
          blur-[110px]
        "
      />

      <div className="relative flex flex-col items-center">
        <div className="relative h-[230px] w-[220px]">
          <motion.div
            className="
              absolute
              left-1/2 top-0
              z-30
              h-9 w-9
              -translate-x-1/2
              rounded-[60%_60%_65%_65%]
              bg-gradient-to-br
              from-[#8B5E3C]
              via-[#593A27]
              to-[#2D1B13]
              shadow-[0_8px_20px_rgba(70,40,25,0.25)]
            "
            style={{
              borderRadius: "55% 55% 60% 60% / 70% 70% 40% 40%",
            }}
            initial={{
              y: -80,
              scale: 0.6,
              opacity: 0,
            }}
            animate={{
              y: [-80, 15, 135],
              scale: [0.6, 1, 0.75],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 1,
              times: [0, 0.25, 1],
              ease: [0.45, 0, 0.55, 1],
            }}
          >
            <div
              className="
                absolute
                left-[8px] top-[6px]
                h-2 w-1
                rotate-[-25deg]
                rounded-full
                bg-white/30
                blur-[1px]
              "
            />
          </motion.div>

          <motion.div
            className="
              absolute
              bottom-[55px] left-1/2
              h-3 w-3
              -translate-x-1/2
              rounded-full
              bg-[#5B3A29]
            "
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              delay: 0.9,
              duration: 0.45,
            }}
          />

          <motion.div
            className="
              absolute
              bottom-[50px] left-1/2
              h-7 w-16
              -translate-x-1/2
              rounded-[50%]
              border border-[#79523A]/50
            "
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, 1.4, 2],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              delay: 0.92,
              duration: 0.65,
              ease: "easeOut",
            }}
          />

          <motion.div
            className="
              absolute
              bottom-[48px] left-1/2
              h-9 w-24
              -translate-x-1/2
              rounded-[50%]
              border border-[#B4975A]/30
            "
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, 1, 1.8],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              delay: 1.05,
              duration: 0.7,
            }}
          />

          <motion.div
            className="
              absolute
              bottom-[45px] left-1/2
              z-40
              -translate-x-1/2
            "
            initial={{
              opacity: 0,
              scale: 0.3,
              y: -10,
            }}
            animate={{
              opacity: [0, 0, 1],
              scale: [0.3, 0.3, 1],
              y: [-10, -10, 0],
            }}
            transition={{
              duration: 1.4,
              times: [0, 0.72, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              className="
                flex h-20 w-20
                items-center justify-center
                rounded-full
                border border-[#B4975A]/30
                bg-[#244C35]
                shadow-[0_18px_50px_rgba(36,76,53,0.25)]
              "
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                delay: 1.4,
                duration: 0.6,
              }}
            >
              <MapPin size={38} strokeWidth={1.4} className="text-[#E5D3A6]" />
            </motion.div>

            <motion.div
              className="
                absolute
                -bottom-4 left-1/2
                h-2 w-12
                -translate-x-1/2
                rounded-[50%]
                bg-[#244C35]/15
                blur-[3px]
              "
              initial={{
                scaleX: 0,
                opacity: 0,
              }}
              animate={{
                scaleX: 1,
                opacity: 1,
              }}
              transition={{
                delay: 1.35,
                duration: 0.4,
              }}
            />
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col items-center"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.4,
            duration: 0.65,
            ease: "easeOut",
          }}
        >
          <p
            className="
              text-[8px]
              uppercase
              tracking-[0.5em]
              text-[#B4975A]
            "
          >
            Welcome To
          </p>

          <h1
            className="
              mt-3
              font-serif
              text-[22px]
              font-medium
              tracking-[0.3em]
              text-[#244C35]
            "
          >
            GREEN VALLEY
          </h1>

          <p
            className="
              mt-2
              text-[8px]
              uppercase
              tracking-[0.55em]
              text-[#B4975A]
            "
          >
            Food One
          </p>
        </motion.div>

        <motion.div
          className="my-6 flex items-center gap-3"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.7,
          }}
        >
          <motion.span
            className="h-px bg-[#B4975A]/60"
            initial={{ width: 0 }}
            animate={{ width: 35 }}
            transition={{
              delay: 1.7,
              duration: 0.5,
            }}
          />

          <motion.span
            className="
              h-[5px] w-[5px]
              rotate-45
              bg-[#B4975A]
            "
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 1.85,
            }}
          />

          <motion.span
            className="h-px bg-[#B4975A]/60"
            initial={{ width: 0 }}
            animate={{ width: 35 }}
            transition={{
              delay: 1.7,
              duration: 0.5,
            }}
          />
        </motion.div>

        <motion.div className="overflow-hidden text-center">
          <motion.h2
            className="
              font-serif
              text-[13px]
              italic
              tracking-[0.18em]
              text-[#244C35]/65
            "
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              delay: 1.85,
              duration: 0.55,
            }}
          >
            Find Us · Contact Us
          </motion.h2>
        </motion.div>

        <div
          className="
            mt-8
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
              delay: 0.4,
              duration: 2,
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
          scale: [1, 1, 16],
          opacity: [0, 0, 0.3],
        }}
        transition={{
          duration: 2.7,
          times: [0, 0.8, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </motion.div>
  );
}
