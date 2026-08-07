import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "@/lib/router-compat";

export default function PageTransition() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const isInitialMount = useRef(true);

  const showLoader = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setIsVisible(true);
    timerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      timerRef.current = null;
    }, 3200);
  };

  useEffect(() => {
    const handleLinkClick = (event) => {
      const target = event.target;
      const link = target instanceof Element ? target.closest("a[href]") : null;

      if (!link) return;

      const href = link.getAttribute("href") || "";
      const isInternalRoute = href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/#");

      if (!isInternalRoute) return;

      event.preventDefault();
      showLoader();
      window.setTimeout(() => {
        navigate(href);
      }, 80);
    };

    document.addEventListener("click", handleLinkClick, true);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    showLoader();
  }, [location.pathname]);

  if (!isVisible) return null;

  return <CoffeePourLoader key={location.pathname} />;
}

function CoffeePourLoader() {
  return (
    <div className="page-transition" aria-hidden="true">
      <div className="relative flex flex-col items-center">
        <div className="relative h-[190px] w-[200px]">
          <div className="absolute left-1/2 top-0 h-[20px] w-[70px] -translate-x-1/2 rounded-full bg-[#6f3518]/20 blur-xl" />
          <div className="coffee-stream absolute left-1/2 top-[-40px] w-[13px] -translate-x-1/2 rounded-full" />
          <div className="splash splash-one" />
          <div className="splash splash-two" />
          <div className="splash splash-three" />
        </div>

        <div className="relative -mt-[50px] h-[190px] w-[270px]">
          <div className="absolute right-[8px] top-[35px] h-[100px] w-[100px] rounded-full border-[20px] border-[#e5ddd0] shadow-[10px_15px_30px_rgba(0,0,0,.45)]" />
          <div className="absolute left-[30px] top-0 z-20 h-[155px] w-[185px] overflow-hidden rounded-b-[90px] rounded-t-[15px] bg-gradient-to-br from-[#fffdf9] via-[#eee7db] to-[#c9bda9] shadow-[0_30px_45px_rgba(0,0,0,.55)]">
            <div className="coffee-fill absolute bottom-0 left-0 w-full">
              <div className="coffee-surface absolute -top-[10px] left-[-5%] h-[22px] w-[110%] rounded-[50%]" />
            </div>
            <div className="absolute left-[20px] top-[22px] z-30 h-[85px] w-[14px] rotate-[7deg] rounded-full bg-gradient-to-b from-white/80 to-transparent blur-[1px]" />
            <div className="absolute left-1/2 top-[60px] z-40 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold tracking-[5px] text-[#50311f]">
              PREMIUM
            </div>
          </div>
          <div className="absolute bottom-[8px] left-[35px] h-[25px] w-[205px] rounded-full bg-black/60 blur-xl" />
        </div>

        <div className="mt-3 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[7px] text-[#d6b28a]">Brewing</p>
          <p className="mt-3 text-[10px] tracking-[3px] text-[#826b59]">YOUR EXPERIENCE</p>
        </div>
      </div>

      <style>{`
        .page-transition {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          background: #120b07;
          opacity: 1;
        }

        .coffee-stream {
          height: 0;
          background: linear-gradient(90deg, #321307, #7c3b18 30%, #a45c2a 50%, #5c260e 75%, #281006);
          box-shadow: 0 0 8px rgba(138,72,30,.3);
          animation: pourCoffee 3.2s cubic-bezier(.4,0,.2,1) forwards;
        }

        @keyframes pourCoffee {
          0% { height: 0; opacity: 0; }
          8% { opacity: 1; }
          15% { height: 200px; }
          78% { height: 200px; opacity: 1; }
          90% { height: 120px; opacity: .8; }
          100% { height: 0; opacity: 0; }
        }

        .coffee-fill {
          height: 0%;
          background: linear-gradient(to top, #2a1007, #4b1e0d 50%, #783716);
          animation: fillCup 3.2s cubic-bezier(.4,0,.2,1) forwards;
        }

        @keyframes fillCup {
          0% { height: 0%; }
          15% { height: 3%; }
          75% { height: 78%; }
          100% { height: 82%; }
        }

        .coffee-surface {
          background: linear-gradient(90deg, #5a260f, #a55b28, #6c2f12);
          box-shadow: inset 0 4px 8px rgba(255,190,120,.18);
          animation: coffeeWave .7s ease-in-out infinite alternate;
        }

        @keyframes coffeeWave {
          0% { transform: translateX(-4px) rotate(-1deg); }
          100% { transform: translateX(4px) rotate(1deg); }
        }

        .splash {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #7b3716;
          opacity: 0;
        }

        .splash-one {
          left: 80px;
          bottom: 4px;
          animation: splashOne 3.2s ease-out forwards;
        }

        .splash-two {
          right: 78px;
          bottom: 8px;
          animation: splashTwo 3.2s ease-out forwards;
        }

        .splash-three {
          left: 100px;
          bottom: 5px;
          animation: splashThree 3.2s ease-out forwards;
        }

        @keyframes splashOne {
          0%, 20%, 100% { opacity: 0; transform: translate(0,0); }
          23% { opacity: 1; transform: translate(-20px,-18px); }
          30% { opacity: 0; transform: translate(-30px,0); }
        }

        @keyframes splashTwo {
          0%, 30%, 100% { opacity: 0; transform: translate(0,0); }
          33% { opacity: 1; transform: translate(20px,-22px); }
          40% { opacity: 0; transform: translate(32px,0); }
        }

        @keyframes splashThree {
          0%, 48%, 100% { opacity: 0; }
          51% { opacity: 1; transform: translate(10px,-20px); }
          58% { opacity: 0; transform: translate(18px,0); }
        }
      `}</style>
    </div>
  );
}
