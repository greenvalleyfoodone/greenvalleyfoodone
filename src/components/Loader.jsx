import { useEffect, useState } from "react";

export default function CoffeePourLoader({ onComplete }) {
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFinishing(true);

      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 500);

      return () => clearTimeout(completeTimer);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        px-4 py-6 sm:px-6
        bg-[rgba(254, 244, 238, 0.96)]
        backdrop-blur-md
        transition-all duration-500
        ${finishing ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"}
      `}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      {/* COMPLETE LOADER */}
      <div className="relative flex w-full max-w-[280px] flex-col items-center justify-center sm:max-w-[340px] md:max-w-[380px] scale-[0.75] sm:scale-[0.9] md:scale-100">

        {/* =====================================
            COFFEE POUR AREA
        ====================================== */}

        <div className="relative h-[145px] w-[150px]">

          {/* Pour Glow */}
          <div
            className="
              absolute
              left-1/2
              top-0
              h-[8px]
              w-[40px]
              -translate-x-1/2
              rounded-full
              bg-white/10
              blur-lg
            "
          />

          {/* Coffee Stream */}
          <div
            className="
              coffee-stream
              absolute
              left-1/2
              top-[-30px]
              w-[9px]
              -translate-x-1/2
              rounded-full
            "
          />

          {/* Splash */}
          <div className="splash splash-one" />
          <div className="splash splash-two" />
          <div className="splash splash-three" />

        </div>


        {/* =====================================
            CUP
        ====================================== */}

        <div className="relative -mt-[38px] h-[145px] w-[205px]">

          {/* CUP HANDLE */}

          <div
            className="
              absolute
              right-[10px]
              top-[27px]
              h-[68px]
              w-[68px]
              rounded-full
              border-[14px]
              border-[#e5ddd0]
              shadow-[7px_10px_20px_rgba(0,0,0,.25)]
            "
          />


          {/* =====================================
              CUP BODY
          ====================================== */}

          <div
            className="
              absolute
              left-[25px]
              top-0
              z-20
              h-[115px]
              w-[140px]
              overflow-hidden

              rounded-t-[10px]
              rounded-b-[70px]

              bg-gradient-to-br
              from-[#fffdf9]
              via-[#eee7db]
              to-[#c9bda9]

              shadow-[0_15px_25px_rgba(0,0,0,.25)]
            "
          >

            {/* COFFEE FILL */}

            <div
              className="
                coffee-fill
                absolute
                bottom-0
                left-0
                w-full
              "
            >

              {/* Coffee Surface */}

              <div
                className="
                  coffee-surface
                  absolute
                  -top-[7px]
                  left-[-5%]
                  h-[15px]
                  w-[110%]
                  rounded-[50%]
                "
              />

            </div>


            {/* =====================================
                CUP SHINE
            ====================================== */}

            <div
              className="
                absolute
                left-[15px]
                top-[17px]
                z-30
                h-[60px]
                w-[9px]
                rotate-[7deg]
                rounded-full
                bg-gradient-to-b
                from-white/70
                to-transparent
                blur-[1px]
              "
            />


            {/* =====================================
                BRAND
            ====================================== */}

            <div
              className="
                absolute
                left-1/2
                top-[45px]
                z-40
                -translate-x-1/2

                whitespace-nowrap

                text-[8px]
                font-semibold
                tracking-[4px]
                text-[#50311f]
              "
            >
              PREMIUM
            </div>

          </div>


          {/* =====================================
              SMALL CUP SHADOW
          ====================================== */}

          <div
            className="
              absolute
              bottom-[12px]
              left-[35px]
              h-[12px]
              w-[140px]
              rounded-full
              bg-black/20
              blur-lg
            "
          />

        </div>


        {/* =====================================
            TEXT
        ====================================== */}

        <div className="-mt-1 text-center">

          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[6px]
              text-[#d6b28a]
            "
          >
            Brewing
          </p>

          <p
            className="
              mt-2
              text-[7px]
              uppercase
              tracking-[3px]
              text-[#826b59]
            "
          >
            Your Experience
          </p>

        </div>

      </div>


      {/* ==========================================
          ANIMATION CSS
      ========================================== */}

      <style>{`

        /*
        ============================================
        COFFEE STREAM
        ============================================
        */

        .coffee-stream {

          height: 0;

          background: linear-gradient(
            90deg,
            #321307 0%,
            #7c3b18 30%,
            #a45c2a 50%,
            #5c260e 75%,
            #281006 100%
          );

          box-shadow:
            0 0 5px rgba(138,72,30,.25);

          animation:
            pourCoffee 2.6s
            cubic-bezier(.4,0,.2,1)
            forwards;
        }


        @keyframes pourCoffee {

          0% {
            height: 0;
            opacity: 0;
          }

          8% {
            opacity: 1;
          }

          15% {
            height: 155px;
          }

          75% {
            height: 155px;
            opacity: 1;
          }

          88% {
            height: 90px;
            opacity: .8;
          }

          100% {
            height: 0;
            opacity: 0;
          }

        }


        /*
        ============================================
        COFFEE FILL
        ============================================
        */

        .coffee-fill {

          height: 0%;

          background: linear-gradient(
            to top,
            #2a1007 0%,
            #4b1e0d 50%,
            #783716 100%
          );

          animation:
            fillCup 2.6s
            cubic-bezier(.4,0,.2,1)
            forwards;
        }


        @keyframes fillCup {

          0% {
            height: 0%;
          }

          15% {
            height: 2%;
          }

          75% {
            height: 76%;
          }

          100% {
            height: 82%;
          }

        }


        /*
        ============================================
        COFFEE SURFACE
        ============================================
        */

        .coffee-surface {

          background: linear-gradient(
            90deg,
            #5a260f,
            #a55b28,
            #6c2f12
          );

          box-shadow:
            inset 0 3px 5px rgba(255,190,120,.16);

          animation:
            coffeeWave .6s
            ease-in-out
            infinite alternate;
        }


        @keyframes coffeeWave {

          0% {
            transform:
              translateX(-3px)
              rotate(-1deg);
          }

          100% {
            transform:
              translateX(3px)
              rotate(1deg);
          }

        }


        /*
        ============================================
        SPLASH
        ============================================
        */

        .splash {

          position: absolute;

          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #7b3716;

          opacity: 0;
        }


        .splash-one {

          left: 58px;
          bottom: 3px;

          animation:
            splashOne 2.6s
            ease-out
            forwards;
        }


        .splash-two {

          right: 58px;
          bottom: 5px;

          animation:
            splashTwo 2.6s
            ease-out
            forwards;
        }


        .splash-three {

          left: 75px;
          bottom: 4px;

          animation:
            splashThree 2.6s
            ease-out
            forwards;
        }


        /*
        ============================================
        SPLASH ONE
        ============================================
        */

        @keyframes splashOne {

          0%,
          20%,
          100% {
            opacity: 0;
            transform: translate(0,0);
          }

          23% {
            opacity: 1;
            transform: translate(-14px,-12px);
          }

          30% {
            opacity: 0;
            transform: translate(-22px,0);
          }

        }


        /*
        ============================================
        SPLASH TWO
        ============================================
        */

        @keyframes splashTwo {

          0%,
          30%,
          100% {
            opacity: 0;
            transform: translate(0,0);
          }

          33% {
            opacity: 1;
            transform: translate(14px,-15px);
          }

          40% {
            opacity: 0;
            transform: translate(22px,0);
          }

        }


        /*
        ============================================
        SPLASH THREE
        ============================================
        */

        @keyframes splashThree {

          0%,
          48%,
          100% {
            opacity: 0;
            transform: translate(0,0);
          }

          51% {
            opacity: 1;
            transform: translate(7px,-14px);
          }

          58% {
            opacity: 0;
            transform: translate(12px,0);
          }

        }

      `}</style>

    </div>
  );
}