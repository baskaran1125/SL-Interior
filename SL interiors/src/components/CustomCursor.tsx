import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", mouseMove);
    
    // Check for interactive elements periodically to handle dynamic content
    const updateInteractions = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    updateInteractions();
    const interval = setInterval(updateInteractions, 1000);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 border border-accent rounded-full pointer-events-none z-[9999] hidden md:block"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
        scale: isHovering ? 2 : 1,
        borderWidth: isHovering ? "1px" : "1.5px",
        backgroundColor: isHovering ? "rgba(182, 149, 103, 0.1)" : "transparent",
      }}
      transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.5 }}
    >
      <motion.div 
        className="absolute top-1/2 left-1/2 w-1 h-1 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: isHovering ? 0 : 1 }}
      />
    </motion.div>
  );
};

export default CustomCursor;
