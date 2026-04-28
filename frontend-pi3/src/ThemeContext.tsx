import { createContext, useContext, useState, ReactNode } from 'react';
import type { Theme } from './themes';
import { temas } from './themes';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  modoColorblind: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [modoColorblind, setModoColorblind] = useState(false);

  const theme = modoColorblind ? temas.colorblind : temas.padrao;

  const toggleTheme = () => {
    setModoColorblind(!modoColorblind);
    localStorage.setItem('modoColorblind', (!modoColorblind).toString());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, modoColorblind }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}