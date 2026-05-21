import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import CustomCursor from "./CustomCursor";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent/30 selection:text-accent">
      <CustomCursor />
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
