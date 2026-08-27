import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Laptop, Moon, Palette, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  useTheme,
  accentSwatches,
  type AccentColor,
} from "../../context/ThemeContext";

const modes = [
  { key: "light" as const, icon: Sun, label: "Light" },
  { key: "dark" as const, icon: Moon, label: "Dark" },
  { key: "system" as const, icon: Laptop, label: "System" },
];

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { mode, setMode, accent, setAccent } = useTheme();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const paletteButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Recalculates position using the trigger button's real screen
  // coordinates. Called on open, and again on scroll/resize while
  // open — it repositions instead of closing, since a fixed navbar
  // means the button rarely actually moves anyway.
  const updatePosition = useCallback(() => {
    const buttonRect = paletteButtonRef.current?.getBoundingClientRect();
    if (!buttonRect) return;

    // Use the popover's real measured width once it exists; fall back
    // to a reasonable estimate before first paint.
    const popoverWidth = popoverRef.current?.offsetWidth ?? 150;

    const left = Math.min(
      Math.max(12, buttonRect.right - popoverWidth),
      window.innerWidth - popoverWidth - 12
    );

    setPopoverPos({ top: buttonRect.bottom + 8, left });
  }, []);

  const openPicker = () => {
    updatePosition();
    setIsPickerOpen((prev) => !prev);
  };

  // Re-measure once the popover has actually mounted, since its real
  // width isn't known until after first render.
  useLayoutEffect(() => {
    if (isPickerOpen) updatePosition();
  }, [isPickerOpen, updatePosition]);

  useEffect(() => {
    if (!isPickerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        paletteButtonRef.current &&
        !paletteButtonRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPickerOpen(false);
    };

    // Reposition on scroll/resize instead of closing — closing here
    // was the actual bug: it fired on any scroll event, including
    // incidental layout shifts right as the popover opened, making
    // it appear to vanish immediately or never fully show.
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isPickerOpen, updatePosition]);

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

      {/* Accent color picker trigger */}
      <button
        ref={paletteButtonRef}
        type="button"
        onClick={openPicker}
        aria-label="Choose accent color"
        aria-expanded={isPickerOpen}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-slate-950 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
      >
        <Palette size={14} />
      </button>

      {/* Popover rendered via portal directly into <body> — fully
          escapes the navbar's overflow-hidden regardless of pill size. */}
      {createPortal(
        <AnimatePresence>
          {isPickerOpen && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                top: popoverPos.top,
                left: popoverPos.left,
                zIndex: 9999,
              }}
              className="flex gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900"
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
                  className="relative h-6 w-6 shrink-0 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: accentSwatches[key],
                    boxShadow:
                      accent === key
                        ? `0 0 0 2px white, 0 0 0 4px ${accentSwatches[key]}`
                        : undefined,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default ThemeToggle;