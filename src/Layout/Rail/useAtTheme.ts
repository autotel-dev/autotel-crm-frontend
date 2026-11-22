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
  // `dark-only` switches the template's own dark styles for older pages.
  b.toggle("at-dark", t === "dark");
  b.toggle("dark-only", t === "dark");
  b.toggle("light", t !== "dark");
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
