import { useEffect, useState } from 'react';

export const useDarkMode = (): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
};

// Za brisanje posto sam napravio hook
// const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   const theme = localStorage.getItem("theme");
  //   if (theme === "dark") {
  //     window.document.documentElement.classList.add("dark");
  //     setIsDarkMode(true);
  //   }
  // }, []);

  // const switchTheme = () => {
  //   if (isDarkMode) {
  //     window.document.documentElement.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //   } else {
  //     localStorage.setItem("theme", "dark");
  //     window.document.documentElement.classList.add("dark");
  //   }
  //   setIsDarkMode(!isDarkMode);
  // };