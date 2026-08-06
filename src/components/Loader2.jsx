import { useEffect } from "react";
import { motion } from "framer-motion";

export default function MenuCardRevealLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        overflow-hidden
        bg-[#f4efe4]
      "
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        filter: "blur(4px)",
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="
          absolute
          h-[500px] w-[500px]
          rounded-full
          bg-[#244c35]/5
          blur-[100px]
        "
      />

      <motion.div
        className="relative h-[390px] w-[290px] perspective-[1200px]"
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.88,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div
          className="
            absolute inset-0
            overflow-hidden
            rounded-r-[18px]
            border border-[#315c3b]/15
            bg-[#fffdf8]
            shadow-[0_30px_80px_rgba(25,50,35,0.20)]
          "
        >
          <motion.div
            className="
              absolute left-1/2 top-8
              h-[1px] bg-[#b69b62]
            "
            initial={{ width: 0, x: "-50%" }}
            animate={{ width: 65 }}
            transition={{
              delay: 1.1,
              duration: 0.6,
            }}
          />

          <motion.div
            className="
              flex h-full flex-col
              items-center
              px-8 pt-16
              text-center
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.9,
              duration: 0.6,
            }}
          >
            <motion.img
              src="/images/logo.png"
              alt="Green Valley Food One"
              className="h-20 w-20 object-contain"
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 1.1,
                duration: 0.6,
                ease: "easeOut",
              }}
            />

            <motion.h1
              className="
                mt-4
                font-serif
                text-[22px]
                font-semibold
                tracking-[0.13em]
                text-[#244c35]
              "
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.3,
                duration: 0.5,
              }}
            >
              GREEN VALLEY
            </motion.h1>

            <motion.p
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-[0.35em]
                text-[#a48852]
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 1.5,
                duration: 0.5,
              }}
            >
              Food One
            </motion.p>

            <motion.div
              className="my-6 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              <span className="h-px w-8 bg-[#b69b62]/50" />

              <span className="text-[8px] text-[#b69b62]">◆</span>

              <span className="h-px w-8 bg-[#b69b62]/50" />
            </motion.div>

            <motion.p
              className="
                font-serif
                text-[12px]
                uppercase
                tracking-[0.5em]
                text-[#315c3b]
              "
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.8,
                duration: 0.5,
              }}
            >
              Menu
            </motion.p>

            <div className="mt-5 w-full space-y-3">
              {[80, 65, 75].map((width, index) => (
                <motion.div
                  key={index}
                  className="mx-auto flex items-center justify-between"
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 1.9 + index * 0.13,
                    duration: 0.45,
                  }}
                >
                  <div
                    className="h-[2px] rounded-full bg-[#315c3b]/15"
                    style={{
                      width: `${width}%`,
                    }}
                  />

                  <div className="ml-3 h-[3px] w-3 rounded-full bg-[#b69b62]/40" />
                </motion.div>
              ))}
            </div>

            <motion.p
              className="
                mt-auto mb-7
                text-[8px]
                uppercase
                tracking-[0.28em]
                text-[#315c3b]/45
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.25 }}
            >
              Cafe • Restaurant
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="
            absolute inset-0
            z-20
            origin-left
            rounded-r-[18px]
            border border-[#d7c18c]/30
            bg-[#214b34]
            shadow-[15px_25px_50px_rgba(0,0,0,0.25)]
          "
          style={{
            transformStyle: "preserve-3d",
          }}
          initial={{
            rotateY: 0,
          }}
          animate={{
            rotateY: -110,
          }}
          transition={{
            delay: 0.55,
            duration: 1.25,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <div
            className="
              absolute inset-4
              rounded-r-xl
              border border-[#d5bd7a]/40
            "
          />

          <div
            className="
              absolute left-0 top-0
              h-full w-[7px]
              bg-black/15
            "
          />

          <div
            className="
              absolute inset-0
              flex flex-col
              items-center justify-center
              text-center
              [backface-visibility:hidden]
            "
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src="/images/logo.png"
                alt="Green Valley"
                className="
                  mx-auto
                  h-20 w-20
                  object-contain
                  brightness-0 invert
                  opacity-90
                "
              />

              <div className="mx-auto my-5 h-px w-12 bg-[#d5bd7a]/70" />

              <p
                className="
                  font-serif
                  text-[11px]
                  uppercase
                  tracking-[0.5em]
                  text-[#e3cf98]
                "
              >
                Menu
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="
            absolute -bottom-8 left-1/2
            h-8 w-[230px]
            -translate-x-1/2
            rounded-[100%]
            bg-black/15
            blur-xl
          "
          animate={{
            scaleX: [0.8, 1, 0.9],
            opacity: [0.1, 0.25, 0.15],
          }}
          transition={{
            duration: 2.5,
          }}
        />
      </motion.div>

      <motion.div
        className="
          absolute bottom-[8%]
          flex flex-col items-center
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <p
          className="
            text-[9px]
            uppercase
            tracking-[0.4em]
            text-[#315c3b]/45
          "
        >
          Discover the taste
        </p>

        <div
          className="
            mt-4
            h-[1px] w-28
            overflow-hidden
            bg-[#315c3b]/10
          "
        >
          <motion.div
            className="h-full bg-[#a48852]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              delay: 1.3,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
