import { useEffect } from "react";
import { motion } from "framer-motion";

export default function ApertureLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const blades = Array.from({ length: 8 });

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#07140d]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Green glow behind the aperture */}
      <motion.div
        className="absolute h-[420px] w-[420px] rounded-full bg-[#315c3b]/20 blur-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Camera aperture */}
      <motion.div
        className="relative h-[300px] w-[300px]"
        initial={{
          scale: 0.75,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        {/* Outer rotating lens ring */}
        <motion.div
          className="
            absolute inset-0
            rounded-full
            border border-white/10
            bg-[#101712]
            shadow-[0_30px_100px_rgba(0,0,0,0.6)]
          "
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Gold lens ring */}
        <div
          className="
            absolute inset-[12px]
            rounded-full
            border border-[#b99b5f]/30
          "
        />

        {/* Inner lens ring */}
        <div
          className="
            absolute inset-[25px]
            rounded-full
            border border-white/10
          "
        />

        {/* Gold lens ticks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => (
          <div
            key={degree}
            className="
              absolute
              left-1/2 top-1/2
              h-[4px] w-[2px]
              bg-[#b99b5f]/50
            "
            style={{
              transform: `
                translate(-50%, -50%)
                rotate(${degree}deg)
                translateY(-137px)
              `,
            }}
          />
        ))}

        {/* Aperture blade area */}
        <motion.div
          className="
            absolute inset-[40px]
            overflow-hidden
            rounded-full
            bg-[#020403]
          "
          initial={{
            rotate: 0,
          }}
          animate={{
            rotate: 50,
          }}
          transition={{
            delay: 0.35,
            duration: 1.5,
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          {/* Aperture blades */}
          {blades.map((_, index) => (
            <motion.div
              key={index}
              className="
                absolute
                left-1/2 top-1/2
                h-[145px] w-[100px]
                origin-bottom
                rounded-[70%_20%_70%_20%]
                border border-white/5
                bg-gradient-to-br
                from-[#384039]
                via-[#1c231e]
                to-[#080b09]
              "
              style={{
                transformOrigin: "0% 0%",
                rotate: index * 45,
              }}
              initial={{
                x: -5,
                y: -5,
                scale: 1.25,
              }}
              animate={{
                x: 50,
                y: 50,
                scale: 0.65,
              }}
              transition={{
                delay: 0.4,
                duration: 1.4,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
          ))}

          {/* Light opening behind the logo */}
          <motion.div
            className="
              absolute
              left-1/2 top-1/2
              z-20
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#f5f0e5]
              shadow-[0_0_60px_rgba(255,245,210,0.25)]
            "
            initial={{
              width: 5,
              height: 5,
            }}
            animate={{
              width: 180,
              height: 180,
            }}
            transition={{
              delay: 0.45,
              duration: 1.3,
              ease: [0.76, 0, 0.24, 1],
            }}
          />

          {/* Same dark rectangular logo background as MenuCardRevealLoader */}
          <motion.div
            className="
              absolute
              left-1/2 top-1/2
              z-30
              flex h-28 w-32
              -translate-x-1/2
              -translate-y-1/2
              items-center justify-center
              rounded-2xl
              border border-[#b69b62]/45
              bg-gradient-to-br
              from-[#173c2b]
              via-[#214b34]
              to-[#102c20]
              shadow-[0_12px_24px_rgba(20,57,38,0.25)]
            "
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 1.15,
              duration: 0.65,
              ease: "easeOut",
            }}
          >
            <img
              src="/images/logo.png"
              alt="Green Valley Food One"
              className="h-24 w-24 object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Lens reflection */}
        <motion.div
          className="
            absolute
            left-[68px] top-[48px]
            h-14 w-5
            rotate-[-40deg]
            rounded-full
            bg-white/10
            blur-md
          "
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.7, 0.25],
          }}
          transition={{
            delay: 0.2,
            duration: 1,
          }}
        />
      </motion.div>

      {/* Brand text */}
      <motion.div
        className="
          absolute
          top-[calc(50%+190px)]
          flex flex-col
          items-center
        "
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
          duration: 0.6,
        }}
      >
        <h2
          className="
            font-serif
            text-lg
            font-medium
            tracking-[0.3em]
            text-[#e8ddc3]
          "
        >
          GREEN VALLEY
        </h2>

        <p
          className="
            mt-2
            text-[8px]
            uppercase
            tracking-[0.5em]
            text-[#b99b5f]
          "
        >
          Food One
        </p>
      </motion.div>

      {/* Final expanding reveal */}
      <motion.div
        className="
          pointer-events-none
          absolute
          left-1/2 top-1/2
          z-50
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border border-[#f5f0e5]/30
        "
        initial={{
          width: 0,
          height: 0,
          opacity: 0,
        }}
        animate={{
          width: [0, 0, "180vmax"],
          height: [0, 0, "180vmax"],
          opacity: [0, 0, 1],
        }}
        transition={{
          duration: 2.55,
          times: [0, 0.72, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </motion.div>
  );
}