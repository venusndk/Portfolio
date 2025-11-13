import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const links = ["Home", "About", "Skills", "Projects", "Contact"];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const linkRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Detect scroll for navbar shrink
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section using IntersectionObserver
  useEffect(() => {
    const sections = links.map((link) =>
      document.getElementById(link.toLowerCase())
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sections.forEach((section) => section && observer.observe(section));
    return () => sections.forEach((section) => section && observer.unobserve(section));
  }, [links]);

  // Smooth scroll with offset
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const navbarHeight = scrolled ? 64 : 72;
    const sectionTop = section.offsetTop - navbarHeight - 8;
    window.scrollTo({
      top: sectionTop,
      behavior: "smooth",
    });
    setOpen(false);
  };

  // Animated underline
  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const activeIndex = links.findIndex((link) => link.toLowerCase() === activeSection);
    const activeLink = linkRefs.current[activeIndex];
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement!.getBoundingClientRect();
      setUnderlineProps({ left: rect.left - parentRect.left, width: rect.width });
    }
  }, [activeSection, scrolled]);

  // Framer Motion variants for staggered menu
  const menuVariants = {
    open: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
    closed: {},
  };

  const linkVariants = {
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
      ${scrolled 
        ? "h-16 bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl shadow-xl shadow-gray-200/50 dark:shadow-purple-900/20 border-b border-gray-200/50 dark:border-purple-500/20" 
        : "h-18 bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg shadow-lg border-b border-gray-200/30 dark:border-gray-800/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full w-full">
        {/* Logo - Optimized for mobile */}
        <motion.a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group select-none flex-shrink-0"
        >
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Decorative glow effect */}
            <motion.div
              className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-green-400/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <span className="relative text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 drop-shadow-sm">
                Ven
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 drop-shadow-sm">
                NDIK
              </span>
            </span>
            
            {/* Sparkle icon */}
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="hidden xs:block"
            >
              <Sparkles size={14} className="sm:w-4 text-yellow-500 dark:text-yellow-400 opacity-70" />
            </motion.div>
          </div>
        </motion.a>

        {/* Desktop Links - Optimized spacing */}
        <div className="hidden md:flex relative items-center font-semibold text-gray-700 dark:text-gray-300">
          <ul className="flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
            {links.map((link, index) => (
              <motion.li
                key={link}
                ref={(el) => (linkRefs.current[index] = el)}
                className="relative cursor-pointer px-3 py-2 lg:px-4 xl:px-4"
                onClick={() => scrollToSection(link.toLowerCase())}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  className={`relative z-10 transition-all duration-300 text-sm lg:text-base ${
                    activeSection === link.toLowerCase()
                      ? "text-blue-600 dark:text-green-400 font-bold"
                      : "hover:text-blue-500 dark:hover:text-green-400 font-semibold"
                  }`}
                >
                  {link}
                </span>
                
                {/* Active background pill */}
                {activeSection === link.toLowerCase() && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full -z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.li>
            ))}
          </ul>
          
          {/* Animated underline */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute bottom-0 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-green-400 dark:via-blue-400 dark:to-purple-400 rounded-full shadow-lg"
            style={{ left: underlineProps.left, width: underlineProps.width }}
          />
        </div>

        {/* Mobile Menu Button - Consistent sizing */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 border border-gray-300 dark:border-gray-700 shadow-md flex items-center justify-center"
          aria-label="Toggle Menu"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} className="text-gray-700 dark:text-gray-300" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} className="text-gray-700 dark:text-gray-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Dropdown Menu - Full width and optimized */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-purple-500/20 shadow-2xl w-full"
          >
            <motion.ul
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col py-4 px-4 space-y-2 text-gray-800 dark:text-gray-200 font-semibold w-full"
            >
              {links.map((link) => (
                <motion.li key={link} variants={linkVariants} className="w-full">
                  <motion.a
                    href={`#${link.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.toLowerCase());
                    }}
                    whileHover={{ scale: 1.02, x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative block w-full px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden group ${
                      activeSection === link.toLowerCase()
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 dark:from-green-500 dark:to-blue-500 text-white shadow-lg"
                        : "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-900"
                    }`}
                  >
                    {/* Animated background on hover */}
                    {activeSection !== link.toLowerCase() && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-green-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                    
                    <span className="relative flex items-center justify-between text-base">
                      <span>{link}</span>
                      {activeSection === link.toLowerCase() && (
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="text-sm"
                        >
                          ✓
                        </motion.span>
                      )}
                    </span>
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
            
            {/* Decorative bottom accent */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-green-400 dark:via-blue-400 dark:to-purple-500 w-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;