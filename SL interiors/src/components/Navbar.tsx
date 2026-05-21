import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Projects", path: "/projects" },
  { label: "Contact", path: "/contact" },
];

const LOGO_SRC = "/SL%20logo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container-luxury flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={LOGO_SRC}
              alt="SL Interiors logo"
              className="h-20 w-20 object-contain scale-125"
            />
            <span className="font-display text-xl tracking-[0.16em] text-white">SL INTERIORS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm tracking-[0.1em] uppercase transition-colors duration-300 hover:text-accent ${
                  location.pathname === link.path ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book"
              className="text-sm tracking-[0.1em] uppercase border border-accent text-accent px-5 py-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            >
              Book Now
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background pt-24"
          >
            <nav className="flex flex-col items-center gap-8 py-12">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-display text-2xl tracking-[0.1em] transition-colors ${
                    location.pathname === link.path ? "text-accent" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/book"
                className="mt-4 border border-accent text-accent px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-accent hover:text-accent-foreground transition-all"
              >
                Book Consultation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
