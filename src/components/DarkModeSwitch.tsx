import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";

export default function DarkModeSwitch({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") === "dark"
      : false
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Switch
      className={`bg-secondary-100 data-[state=checked]:bg-primary-400 ${className}`}
      checked={isDark}
      onCheckedChange={() => setIsDark(!isDark)}
    />
  );
}
