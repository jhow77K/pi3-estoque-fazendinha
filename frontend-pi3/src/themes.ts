interface Theme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  danger: string;
  link: string;
}

const themePadrao: Theme = {
  primary: '#7c3aed',
  primaryDark: '#6d28d9',
  primaryLight: '#a78bfa',
  background: '#fdfdfd',
  textPrimary: '#1a1a1a',
  textSecondary: '#757575',
  success: '#2ecc71',
  warning: '#e67e22',
  danger: '#e74c3c',
  link: '#3498db',
};

const themeColorblind: Theme = {
  primary: '#003f5c',
  primaryDark: '#58508d',
  primaryLight: '#bc5090',
  background: '#fdfdfd',
  textPrimary: '#1a1a1a',
  textSecondary: '#757575',
  success: '#2ecc71',
  warning: '#e67e22',
  danger: '#e74c3c',
  link: '#3498db',
};

export const temas = {
  padrao: themePadrao,
  colorblind: themeColorblind,
};

export type { Theme };