import { ArrowUp } from "lucide-react";

import { useSiteSettings } from "../../hooks/useSiteSettings";

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
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Identity */}
          <div>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                handleScrollTop();
              }}
              className="text-lg font-semibold tracking-tight text-slate-950"
            >
              {settings?.name || "Portfolio"}
            </a>

            <p className="mt-2 text-sm text-slate-500">
              © {currentYear}{" "}
              {settings?.name || "Portfolio"}. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="#about"
              className="text-sm text-slate-600 transition-colors hover:text-slate-950"
            >
              About
            </a>

            <a
              href="#projects"
              className="text-sm text-slate-600 transition-colors hover:text-slate-950"
            >
              Projects
            </a>

            <a
              href="#experience"
              className="text-sm text-slate-600 transition-colors hover:text-slate-950"
            >
              Experience
            </a>

            <a
              href="#contact"
              className="text-sm text-slate-600 transition-colors hover:text-slate-950"
            >
              Contact
            </a>

            <button
              type="button"
              onClick={handleScrollTop}
              aria-label="Back to top"
              className="inline-flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-600 transition-colors hover:border-slate-950 hover:text-slate-950"
            >
              <ArrowUp size={17} />
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;