import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? (localStorage.getItem("theme") || "light") : "light"
  );

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:scale-105 transition"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <>
          <i className="ri-moon-line text-lg text-sky-300" />
          <span className="text-sm text-sky-200">Dark</span>
        </>
      ) : (
        <>
          <i className="ri-sun-line text-lg text-yellow-300" />
          <span className="text-sm text-sky-200">Light</span>
        </>
      )}
    </button>
  );
}
