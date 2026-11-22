// Slim icon rail (Option C). Items with children (Setup) open a flyout panel.
import { useEffect, useRef, useState, MouseEvent as ReactMouseEvent, FocusEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ICONS } from "./icons";
import { NavItem } from "./useNavItems";

interface Props {
  items: NavItem[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const U = process.env.PUBLIC_URL || "";

const isActive = (item: NavItem, path: string) => {
  if (item.link) {
    const l = item.link.replace(U, "");
    return path === l || path.startsWith(l + "/");
  }
  return (item.children || []).some((c) => {
    const l = c.link.replace(U, "");
    return path === l || path.startsWith(l + "/");
  });
};

const RailNav = ({ items, theme, onToggleTheme }: Props) => {
  const { pathname } = useLocation();
  const path = pathname.replace(U, "");
  const [open, setOpen] = useState<string | null>(null);
  const [tip, setTip] = useState<{ text: string; top: number; left: number } | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  // Close the flyout on navigation, Escape or a click outside it.
  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (flyoutRef.current?.contains(t) || t.closest?.(".at-rail")) return;
      setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const showTip = (text: string) => (e: ReactMouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (window.innerWidth < 768) return;
    setTip({ text, top: r.top + r.height / 2, left: r.right + 10 });
  };
  const hideTip = () => setTip(null);

  const renderItem = (item: NavItem) => {
    const active = isActive(item, path);
    const cls = `at-rail__btn${active ? " is-active" : ""}${open === item.key ? " is-open" : ""}`;
    const tipProps = {
      onMouseEnter: showTip(item.title),
      onMouseLeave: hideTip,
      onFocus: showTip(item.title),
      onBlur: hideTip,
    };
    if (item.children) {
      return (
        <button
          key={item.key}
          type="button"
          className={cls}
          aria-label={item.title}
          aria-expanded={open === item.key}
          onClick={() => {
            hideTip();
            setOpen(open === item.key ? null : item.key);
          }}
          {...tipProps}
        >
          {ICONS[item.icon] || ICONS.module}
        </button>
      );
    }
    return (
      <Link key={item.key} to={item.link || "#"} className={cls} aria-label={item.title} aria-current={active ? "page" : undefined} {...tipProps}>
        {ICONS[item.icon] || ICONS.module}
      </Link>
    );
  };

  const top = items.filter((i) => !i.bottom);
  const bottom = items.filter((i) => i.bottom);
  const openItem = items.find((i) => i.key === open);

  return (
    <>
      <nav className="at-rail" aria-label="Main">
        <Link to={`${U}/dashboard`} className="at-rail__logo" aria-label="Autotel home">
          A
        </Link>
        <div className="at-rail__items">
          {top.map(renderItem)}
          <div className="at-rail__spacer" />
          {bottom.map(renderItem)}
          <button
            type="button"
            className="at-rail__btn"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => {
              hideTip();
              onToggleTheme();
            }}
            onMouseEnter={showTip(theme === "dark" ? "Light theme" : "Dark theme")}
            onMouseLeave={hideTip}
          >
            {theme === "dark" ? ICONS.sun : ICONS.moon}
          </button>
        </div>
      </nav>

      {tip && (
        <div className="at-rail__tip" style={{ top: tip.top, left: tip.left }} role="presentation">
          {tip.text}
        </div>
      )}

      {openItem && openItem.children && (
        <div className="at-flyout" ref={flyoutRef} role="dialog" aria-label={openItem.title}>
          <h2 className="at-flyout__title">{openItem.title}</h2>
          <div className="at-flyout__list">
            {openItem.children.map((c) => {
              const l = c.link.replace(U, "");
              const active = path === l || path.startsWith(l + "/");
              return (
                <Link key={c.link} to={c.link} className={`at-flyout__link${active ? " is-active" : ""}`}>
                  {c.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default RailNav;
