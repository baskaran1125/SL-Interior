import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Projects", path: "/projects" },
  { label: "Contact", path: "/contact" },
];

const LOGO_SRC = "/SL%20logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-luxury py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={LOGO_SRC}
                alt="SL Interiors logo"
                className="h-32 w-32 object-contain"
              />
              <h3 className="font-display text-2xl tracking-[0.15em]">SL INTERIORS</h3>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
              Crafting timeless interiors that reflect your personality and elevate your everyday living.
            </p>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.15em] uppercase mb-6 text-primary-foreground/40">Navigation</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.15em] uppercase mb-6 text-primary-foreground/40">Get in Touch</h4>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <p>slinterior07@gmail.com</p>
              <p>+91 9043140047 | +91 9444291009</p>
              <p>21, MGR ST, M.G NAGAR, THARAMANI, CH-113</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} SL Interiors. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-primary-foreground/40 hover:text-accent transition-colors">Instagram</a>
            <a href="#" className="text-xs text-primary-foreground/40 hover:text-accent transition-colors">Pinterest</a>
            <a href="#" className="text-xs text-primary-foreground/40 hover:text-accent transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
