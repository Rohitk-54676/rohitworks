import { ArrowUp, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { useSiteSettings } from "../../hooks/useSiteSettings";

const footerLinks = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "All Projects", href: "/projects" },
  { label: "All Skills", href: "/skills" },
  { label: "Development", href: "/#development" },
  { label: "Journey", href: "/#journey" },
  { label: "Contact", href: "/#contact" },
];

const Footer = () => {
  const { data: settings } = useSiteSettings();

  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{
          backgroundColor: "var(--accent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_1fr]"
        >
          {/* Brand */}
          <div className="max-w-sm">
            <a
              href="/#home"
              className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
            >
              {settings?.name || "Rohit Kumar"}
            </a>

            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {settings?.bio
                ? settings.bio.length > 170
                  ? `${settings.bio.slice(0, 170)}…`
                  : settings.bio
                : "Building practical, scalable web applications and turning ideas into functional products."}
            </p>

            {settings?.availability_status && (
              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                {settings.availability_status}
              </span>
            )}
          </div>

          {/* Footer links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Explore
            </p>

            <nav className="mt-4 flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-slate-600 transition-colors hover:text-[var(--accent)] dark:text-slate-400 dark:hover:text-[var(--accent)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Get in touch
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-[var(--accent)] dark:text-slate-400 dark:hover:text-[var(--accent)]"
                >
                  <Mail size={15} />

                  <span className="truncate">
                    {settings.email}
                  </span>
                </a>
              )}

              {settings?.location && (
                <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin size={15} />

                  <span>
                    {settings.location}
                  </span>
                </div>
              )}

              <a
                href="/#contact"
                className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                Send a message
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="mt-14 flex flex-col items-center gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 sm:flex-row sm:justify-between"
        >
          <p className="text-sm text-slate-500">
            © {currentYear}{" "}
            {settings?.name || "Rohit Kumar"}.
            All rights reserved.
          </p>

          <motion.button
            type="button"
            onClick={handleScrollTop}
            aria-label="Back to top"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] dark:border-slate-700 dark:text-slate-400"
          >
            <ArrowUp size={17} />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;