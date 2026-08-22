import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

import { useSiteSettings } from "../../hooks/useSiteSettings";
import { Reveal } from "../../lib/motion";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  const { data: settings } = useSiteSettings();

  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* Ambient accent glow, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
        style={{ backgroundColor: "var(--accent)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Identity */}
          <div>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                handleScrollTop();
              }}
              className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white"
            >
              {settings?.name || "Portfolio"}
            </a>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              © {currentYear} {settings?.name || "Portfolio"}. All rights
              reserved.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}

            <motion.button
              type="button"
              onClick={handleScrollTop}
              aria-label="Back to top"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] dark:border-slate-700 dark:text-slate-400"
            >
              <ArrowUp size={17} />
            </motion.button>
          </nav>
        </Reveal>
      </div>
    </footer>
  );
};

export default Footer;
