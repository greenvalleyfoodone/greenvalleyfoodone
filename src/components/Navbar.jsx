import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

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
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-valley-forest/95 backdrop-blur border-b border-valley-gold/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 md:px-8 py-4">
        <NavLink to="/" className="font-display text-xl md:text-2xl text-valley-ivory tracking-tight">
          Green Valley
        </NavLink>

        <ul className="hidden md:flex items-center gap-7 font-mono text-[13px] uppercase tracking-wide">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={() => {
                  const isExact = location.pathname === l.to;
                  const isMenuNested = l.to === "/menu" && location.pathname.startsWith("/menu");
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
          className="hidden md:inline-block bg-valley-gold text-valley-ink font-mono text-[13px] uppercase tracking-wide px-4 py-2 rounded-sm hover:bg-valley-ivory transition-colors"
        >
          Reserve a table
        </NavLink>

        <button
          className="md:hidden text-valley-ivory"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-valley-forest border-t border-valley-gold/20 px-5 py-4">
          <ul className="flex flex-col gap-4 font-mono text-sm uppercase tracking-wide">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={() => {
                    const isExact = location.pathname === l.to;
                    const isMenuNested = l.to === "/menu" && location.pathname.startsWith("/menu");
                    return isExact || isMenuNested ? "text-valley-gold" : "text-valley-ivory/80";
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
                className="inline-block bg-valley-gold text-valley-ink px-4 py-2 rounded-sm mt-2"
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