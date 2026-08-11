import { Link } from "@/lib/router-compat";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Home,
  Coffee,
  UtensilsCrossed,
  BookOpen,
  Briefcase,
  Image,
  Info,
  MessageCircle,
  ExternalLink
} from "lucide-react";


export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerHeadingId = "footer-heading";


  const exploreLinks = [
    { label: "Home", to: "/", icon: Home },
    { label: "Cafe", to: "/cafe", icon: Coffee },
    { label: "Restaurant", to: "/restaurant", icon: UtensilsCrossed },
    { label: "Menu", to: "/menu", icon: BookOpen },
    { label: "Services", to: "/services", icon: Briefcase },
    { label: "Gallery", to: "/gallery", icon: Image },
    { label: "About", to: "/about", icon: Info },
    { label: "Contact", to: "/contact", icon: MessageCircle },
  ];


  return (
    <footer
      className="bg-[#0a1f0a] text-[#f5f5dc]"
      aria-labelledby={footerHeadingId}
      role="contentinfo"
    >
      <h2 id={footerHeadingId} className="sr-only">
        Green Valley site footer
      </h2>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
        
        {/* Brand Column */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-900/50">
              <div className="w-3 h-3 bg-[#f5f5dc] rounded-full" />
            </div>
            <span className="font-serif text-2xl tracking-tight text-[#f5f5dc]">
              Green Valley
            </span>
          </div>
          
          <p className="text-[#f5f5dc]/60 text-sm leading-relaxed max-w-xs">
            A cafe by night, a restaurant by day. Born from the valley, brewed
            with love — and served in the heart of Santhamaguluru.
          </p>


          <div className="flex items-center gap-3 pt-1">
            <a 
              href="https://www.instagram.com/greenvalleyfoodone?igsh=b2ZlMHI2NWd5OGZ3" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-[#f5f5dc]/20 flex items-center justify-center text-[#f5f5dc]/60 hover:text-amber-400 hover:border-amber-400/40 transition-all duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a 
              href="https://facebook.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full border border-[#f5f5dc]/20 flex items-center justify-center text-[#f5f5dc]/60 hover:text-amber-400 hover:border-amber-400/40 transition-all duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a 
              href="https://www.youtube.com/@GREENVALLEYFOODONE" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-10 h-10 rounded-full border border-[#f5f5dc]/20 flex items-center justify-center text-[#f5f5dc]/60 hover:text-amber-400 hover:border-amber-400/40 transition-all duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
              </svg>
            </a>
          </div>
        </div>


        {/* Explore Column */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-amber-500 font-semibold mb-5">
            Explore
          </h3>
          <nav aria-label="Footer explore links">
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2.5">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.to}
                    className="group flex items-center gap-2.5 text-sm text-[#f5f5dc]/70 hover:text-amber-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 rounded-sm"
                    >
                    <item.icon className="w-3.5 h-3.5 text-[#f5f5dc]/30 group-hover:text-amber-400 transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>


        {/* Visit Column */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-amber-500 font-semibold mb-5">
            Visit
          </h3>
          <address className="not-italic">
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[#f5f5dc]/70">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  Santhamaguluru, Prakasam,<br />Andhra Pradesh
                </span>
              </li>
              <li>
                <a 
                  href="tel:+919866255533" 
                  className="flex items-center gap-3 text-sm text-[#f5f5dc]/70 hover:text-amber-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 rounded-sm"
                >
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>98662 55533</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:greenvalleyinfo@gmail.com" 
                  className="flex items-center gap-3 text-sm text-[#f5f5dc]/70 hover:text-amber-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 rounded-sm"
                >
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>greenvalleyinfo.in</span>
                </a>
              </li>
            </ul>
          </address>
        </div>
      </div>


      {/* Bottom Bar */}
      <div className="border-t border-[#f5f5dc]/10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#f5f5dc]/40">
          <p>© {currentYear} Green Valley. All rights reserved.</p>
          
          {/* B TO P NEXUS Credit */}
          <div className="flex items-center gap-2">
            <span>Designed by</span>
            <a 
              href="https://btopnexus.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#f5f5dc]/60 hover:text-amber-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 rounded-sm"
            >
              <span className="font-semibold tracking-wide">B TO P NEXUS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="mx-1">·</span>
            <a 
              href="https://btopnexus.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500/80 hover:text-amber-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 rounded-sm font-medium"
            >
              Visit Now
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}