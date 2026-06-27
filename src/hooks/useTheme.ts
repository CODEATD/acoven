import { useState, useEffect } from 'react';

export function useTheme() {
  const theme: 'light' | 'dark' = 'light';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
  }, []);

  const toggleTheme = () => {}; // Disabled for Rotaract brand consistency

  return { theme, toggleTheme };
}
