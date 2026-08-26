import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ThemeToggle from "../common/ThemeToggle";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Development", href: "/#development" },
  { label: "Journey", href: "/#journey" },
];

const NAV_HEIGHT_PX = 72;

const Navbar = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLinkClick = () => setIsMenuOpen(false);

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

  const scrollToSection = (id: string) => {
    const isHome = window.location.pathname === "/";

    const doScroll = () => {
      const element = document.getElementById(id);
      if (!element) return;

      const top =
        element.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT_PX;

      window.scrollTo({ top, behavior: "smooth" });
    };

    if (!isHome) {
      navigate("/");
      window.setTimeout(doScroll, 150);
    } else {
      window.setTimeout(doScroll, 50);
    }
  };

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (longPressTimer.current !== null) return;
    handleLinkClick();
    scrollToSection("home");
  };

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();
    handleLinkClick();
    scrollToSection(href.split("#")[1]);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.split("#")[1]);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[999] flex justify-center">
      <div
        className={`relative isolate flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled ? "mt-3 w-[94%] max-w-[720px]" : "mt-0 w-full"
        }`}
      >
        {/* Ambient glow — a separate layer BEHIND the nav, so blur can
            bleed past the pill's own edges instead of being clipped by
            the nav's own overflow-hidden. Only relevant once shrunk. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 -z-10 rounded-full blur-xl"
          style={{ backgroundColor: "var(--accent)" }}
          animate={{
            opacity: isScrolled ? (isHovered ? 0.35 : 0.15) : 0,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* The pill itself — logo, links, actions only. No dropdown lives
            in here, so it can never be forced into an oval/egg shape. */}
        <nav
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`pointer-events-auto w-full overflow-hidden border transition-[border-radius,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "rounded-full border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90"
              : "rounded-none border-transparent bg-white dark:bg-slate-950"
          }`}
        >
          <div
            className={`mx-auto flex items-center justify-between transition-[height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? "h-12 px-4" : "h-[72px] px-4 sm:px-6 lg:px-8"
            }`}
          >
            {/* Logo */}
            <a
              href="/#home"
              onClick={handleLogoClick}
              onTouchStart={handleLogoTouchStart}
              onTouchEnd={handleLogoTouchEnd}
              onTouchCancel={handleLogoTouchEnd}
              className={`flex shrink-0 select-none items-center justify-center rounded-full bg-[var(--accent)] font-bold text-white transition-all duration-300 hover:scale-105 ${
                isScrolled ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
              }`}
              aria-label="Go to home"
            >
              R
            </a>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.split("#")[1];

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    className={`relative rounded-full font-medium text-slate-600 transition-all duration-300 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white ${
                      isScrolled ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${
                        isActive ? "text-slate-950 dark:text-white" : ""
                      }`}
                    >
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Desktop actions */}
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <ThemeToggle />
              <a
                href="/#contact"
                onClick={(event) => handleNavClick(event, "/#contact")}
                className={`rounded-full bg-slate-950 font-medium text-white transition-all duration-300 hover:opacity-90 dark:bg-white dark:text-slate-950 ${
                  isScrolled ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
                }`}
              >
                Contact
              </a>
            </div>

            {/* Mobile actions */}
            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <ThemeToggle />

              <button
                type="button"
                onClick={() => setIsMenuOpen((previous) => !previous)}
                className="pointer-events-auto relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile dropdown — a completely separate card below the pill,
            with its own normal rounded-2xl corners. It is NOT a child of
            <nav>, so it can never inherit the pill's rounded-full clip. */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950 lg:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="relative z-10 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    {link.label}
                  </motion.a>
                ))}

                <a
                  href="/#contact"
                  onClick={(event) => handleNavClick(event, "/#contact")}
                  className="relative z-10 mt-3 rounded-md bg-slate-950 px-4 py-2.5 text-center text-sm font-medium text-white dark:bg-white dark:text-slate-950"
                >
                  Contact
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;