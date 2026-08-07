import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "@/lib/router-compat";

const links = [
  { to: "/", label: "Home" },
  { to: "/cafe", label: "Cafe" },
  { to: "/restaurant", label: "Restaurant" },
  { to: "/menu", label: "Menu" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 12);

      // Don't hide the bar while the mobile menu is open, or right at the top
      if (open || y < 80) {
        setHidden(false);
      } else if (y > lastY.current) {
        // Scrolling down -> slide out of view
        setHidden(true);
      } else if (y < lastY.current) {
        // Scrolling up -> slide back in
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-valley-forest backdrop-blur border-b border-valley-gold/20 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="w-full flex items-center justify-between px-6 md:px-10 py-3 md:py-4">
        <NavLink to="/" className="flex items-center shrink-0">
          <img
            src="/images/logo.png"
            alt="Green Valley Food One"
            width={96}
            height={96}
            className="h-24 w-24 md:h-32 md:w-32 object-contain"
          />
        </NavLink>

        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8 font-mono text-sm uppercase tracking-wide">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={() => {
                    const isExact = location.pathname === l.to;

                    const isMenuNested =
                      l.to === "/menu" &&
                      location.pathname.startsWith("/menu");

                    const active = isExact || isMenuNested;

                    return `pb-1 border-b transition-colors ${
                      active
                        ? "text-valley-gold border-valley-gold"
                        : "text-valley-ivory/80 border-transparent hover:text-valley-gold hover:border-valley-gold/50"
                    }`;
                  }}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <NavLink
            to="/reservation"
            className="inline-block bg-valley-gold text-valley-ink font-mono text-sm uppercase tracking-wide px-5 py-2.5 rounded-sm hover:bg-valley-ivory transition-colors"
          >
            Reserve a table
          </NavLink>
        </div>

        <button
          className="md:hidden text-valley-ivory"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-valley-forest backdrop-blur-md border-t border-valley-gold/20 px-6 py-5">
          <ul className="flex flex-col gap-4 font-mono text-base uppercase tracking-wide">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={() => {
                    const isExact = location.pathname === l.to;

                    const isMenuNested =
                      l.to === "/menu" &&
                      location.pathname.startsWith("/menu");

                    return isExact || isMenuNested
                      ? "text-valley-gold"
                      : "text-valley-ivory/80";
                  }}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}

            <li>
              <NavLink
                to="/reservation"
                onClick={() => setOpen(false)}
                className="inline-block bg-valley-gold text-valley-ink px-5 py-2.5 rounded-sm mt-2"
              >
                Reserve a table
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}