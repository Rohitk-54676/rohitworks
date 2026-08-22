import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";
export type AccentColor = "indigo" | "emerald" | "rose" | "amber";

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const MODE_KEY = "portfolio-theme-mode";
const ACCENT_KEY = "portfolio-theme-accent";

export const accentSwatches: Record<AccentColor, string> = {
  indigo: "#6366f1",
  emerald: "#10b981",
  rose: "#f43f5e",
  amber: "#f59e0b",
};

function getSystemPreference(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(MODE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

function getInitialAccent(): AccentColor {
  if (typeof window === "undefined") return "indigo";
  const stored = window.localStorage.getItem(ACCENT_KEY);
  if (stored && stored in accentSwatches) return stored as AccentColor;
  return "indigo";
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(
    getSystemPreference
  );
  const [accent, setAccentState] = useState<AccentColor>(getInitialAccent);

  // Track OS-level changes live, in case mode === "system"
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () =>
      setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    mode === "system" ? systemTheme : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", accentSwatches[accent]);
    root.dataset.accent = accent;
  }, [accent]);

  useEffect(() => {
    window.localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    window.localStorage.setItem(ACCENT_KEY, accent);
  }, [accent]);

  const setMode = (next: ThemeMode) => setModeState(next);

  const cycleMode = () =>
    setModeState((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
    );

  const setAccent = (next: AccentColor) => setAccentState(next);

  const value = useMemo(
    () => ({ mode, resolvedTheme, setMode, cycleMode, accent, setAccent }),
    [mode, resolvedTheme, accent]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
