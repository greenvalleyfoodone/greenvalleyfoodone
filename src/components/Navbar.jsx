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

      // Keep navbar visible when menu is open or page is near the top
      if (open || y < 80) {
        setHidden(false);
      } else if (y > lastY.current) {
        // Scrolling down: hide navbar
        setHidden(true);
      } else if (y < lastY.current) {
        // Scrolling up: show navbar
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  const isActiveLink = (path) => {
    const isExact = location.pathname === path;
    const isMenuNested =
      path === "/menu" && location.pathname.startsWith("/menu");

    return isExact || isMenuNested;
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-valley-forest/95 backdrop-blur border-b border-valley-gold/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="w-full flex items-center justify-between px-6 md:px-10 py-3 md:py-4"
      >
        {/* Logo */}
        <NavLink to="/" className="flex items-center shrink-0">
          <img
            src="/images/logo.png"
            alt="Green Valley Food One"
            width={128}
            height={128}
            className="h-24 w-24 md:h-32 md:w-32 object-contain"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <ul className="flex items-center gap-5 lg:gap-8 font-mono text-sm uppercase tracking-wide">
            {links.map((link) => {
              const active = isActiveLink(link.to);

              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={`pb-1 border-b transition-colors ${
                      active
                        ? "text-valley-gold border-valley-gold"
                        : "text-valley-ivory/80 border-transparent hover:text-valley-gold hover:border-valley-gold/50"
                    }`}
                  >
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Reserve button + coffee cup */}
          <div className="flex items-center shrink-0">
            <NavLink
              to="/reservation"
              className="inline-flex items-center gap-2 bg-valley-gold text-valley-ink font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-full shadow-md hover:bg-valley-ivory hover:scale-[1.02] transition-all"
            >
              {/* Calendar icon */}
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 3v4M8 3v4M3 10h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <span>Reserve a table</span>

              {/* Arrow icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>

            {/* Right-side cup image */}
            <img
              src="/images/coffee-cup.png"
              alt=""
              aria-hidden="true"
              width={110}
              height={110}
              className="h-20 w-20 lg:h-24 lg:w-24 object-contain -ml-2 -mr-5 pointer-events-none"
            />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-valley-ivory"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
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

      {/* Mobile Navigation */}
      {open && (
        <div
          id="mobile-navigation"
          className="md:hidden bg-valley-forest/95 backdrop-blur-md border-t border-valley-gold/20 px-6 py-5"
        >
          <ul className="flex flex-col gap-4 font-mono text-base uppercase tracking-wide">
            {links.map((link) => {
              const active = isActiveLink(link.to);

              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={
                      active
                        ? "text-valley-gold"
                        : "text-valley-ivory/80 hover:text-valley-gold transition-colors"
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              );
            })}

            <li className="pt-2">
              <NavLink
                to="/reservation"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 bg-valley-gold text-valley-ink px-5 py-3 rounded-full"
              >
                <span>Reserve a table</span>

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}