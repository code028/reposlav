import { Moon, Sun } from "lucide-react";
import React from "react";
import { useDarkMode } from "../../hooks/useDarkMode";

const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const [theme, setTheme] = useDarkMode();
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`w-full h-screen grid place-items-center ${className} bg-primary-custom relative`}>
      <button className="absolute top-3 right-3 px-3 py-1 bg-white dark:bg-black text-black dark:text-white " onClick={toggleTheme}>
        { theme === 'dark' ? <Moon size={28} /> : <Sun size={28} /> }
      </button>
      {children}
    </div>
  );
};

export default Container;
