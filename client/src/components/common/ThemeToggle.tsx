import { useState, useRef, useEffect } from "react";
import { Laptop, Moon, Palette, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useTheme, accentSwatches, type AccentColor } from "../../context/ThemeContext";

const modes = [
  { key: "light" as const, icon: Sun, label: "Light" },
  { key: "dark" as const, icon: Moon, label: "Dark" },
  { key: "system" as const, icon: Laptop, label: "System" },
];

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { mode, setMode, accent, setAccent } = useTheme();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Light / Dark / System segmented control */}
      <div className="relative inline-flex items-center rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
        {modes.map(({ key, icon: Icon, label }) => {
          const isActive = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              aria-label={`Use ${label.toLowerCase()} theme`}
              aria-pressed={isActive}
              className="relative rounded-full p-1.5"
            >
              {isActive && (
                <motion.span
                  layoutId="theme-mode-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-slate-950"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              <Icon
                size={14}
                className={`relative z-10 ${
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Accent color picker */}
      <div ref={pickerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsPickerOpen((prev) => !prev)}
          aria-label="Choose accent color"
          aria-expanded={isPickerOpen}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-slate-950 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
        >
          <Palette size={14} />
        </button>

        <AnimatePresence>
          {isPickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 flex gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              {(Object.keys(accentSwatches) as AccentColor[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setAccent(key);
                    setIsPickerOpen(false);
                  }}
                  aria-label={`${key} accent`}
                  className="relative h-6 w-6 rounded-full ring-offset-2 ring-offset-white transition-transform hover:scale-110 dark:ring-offset-slate-900"
                  style={{
                    backgroundColor: accentSwatches[key],
                    boxShadow: accent === key ? `0 0 0 2px ${accentSwatches[key]}` : undefined,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ThemeToggle;
