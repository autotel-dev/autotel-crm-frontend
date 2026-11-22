// Light (C1) / dark (C4) theme switch, remembered per browser.
import { useCallback, useEffect, useState } from "react";

export type AtTheme = "light" | "dark";
const KEY = "at-theme";

const read = (): AtTheme => {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

const apply = (t: AtTheme) => {
  const b = document.body.classList;
  // The template's own `dark-only` styles are incomplete in this project
  // (dark text on dark tables), so older pages use our overrides in
  // theme/autotel.scss instead.
  b.toggle("at-dark", t === "dark");
  b.remove("dark-only");
};

export const useAtTheme = () => {
  const [theme, setTheme] = useState<AtTheme>(read);

  useEffect(() => {
    apply(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* private mode: theme still applies for this visit */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
};
