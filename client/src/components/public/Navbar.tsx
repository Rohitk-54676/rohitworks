import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ThemeToggle from "../common/ThemeToggle";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Development", href: "#development" },
  { label: "Journey", href: "#journey" },
];

const Navbar = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const longPressTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const handleLinkClick = () => setIsMenuOpen(false);

  /*
   * Mobile admin shortcut.
   * Hold the R logo for 1 second.
   */

  const handleLogoTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      navigate("/admin");
      longPressTimer.current = null;
    }, 1000);
  };

  const handleLogoTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  /*
   * Prevent the normal logo click after
   * a successful long press.
   */

  const handleLogoClick = () => {
    if (longPressTimer.current === null) {
      return;
    }

    handleLinkClick();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((link) =>
      link.href.replace("#", "")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  /*
   * Cleanup long-press timer.
   */

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? "border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80"
          : "border-transparent bg-white dark:bg-slate-950"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}

        <a
          href="#home"
          onClick={handleLogoClick}
          onTouchStart={handleLogoTouchStart}
          onTouchEnd={handleLogoTouchEnd}
          onTouchCancel={handleLogoTouchEnd}
          className="flex h-9 w-9 select-none items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white transition-transform hover:scale-105"
          aria-label="Go to home"
        >
          R
        </a>

        {/* Desktop navigation */}

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              activeSection ===
              link.href.replace("#", "");

            return (
              <a
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}

                <span
                  className={`relative z-10 ${
                    isActive
                      ? "text-slate-950 dark:text-white"
                      : ""
                  }`}
                >
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Desktop actions */}

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          <a
            href="#contact"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-slate-950"
          >
            Contact
          </a>
        </div>

        {/* Mobile actions */}

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(
                (previous) => !previous
              )
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {navLinks.map(
                (link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    initial={{
                      opacity: 0,
                      x: -12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.03,
                    }}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    {link.label}
                  </motion.a>
                )
              )}

              <a
                href="#contact"
                onClick={handleLinkClick}
                className="mt-3 rounded-md bg-slate-950 px-4 py-2.5 text-center text-sm font-medium text-white dark:bg-white dark:text-slate-950"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;