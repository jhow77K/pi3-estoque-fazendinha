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
  primary: '#0061ff',       // Azul profissional vibrante (estilo SaaS corporativo)
  primaryDark: '#004ecb',   // Azul profundo para hover
  primaryLight: '#e6f0ff',  // Fundo de destaque muito suave
  background: '#ffffff',    // Branco puro para máxima clareza
  textPrimary: '#1e293b',   // Slate-800: Cinza azulado escuro para leitura confortável
  textSecondary: '#64748b', // Slate-500: Para informações de suporte
  success: '#16a34a',       // Verde esmeralda para operações bem-sucedidas
  warning: '#ea580c',       // Laranja corporativo (melhor que amarelo em fundos brancos)
  danger: '#dc2626',        // Vermelho de erro padrão
  link: '#0061ff',          // Link acompanhando a marca
};

const themeColorblind: Theme = {
  // Baseado no 'Primer' do GitHub (Foco em Protanopia/Deuteranopia)
  primary: '#218bff',       // Azul de alta visibilidade
  primaryDark: '#0550ae',   // Azul marinho para contraste severo
  primaryLight: '#c2e0ff',  // Azul celeste claro
  background: '#f6f8fa',    // Cinza muito claro (estilo GitHub/Azure)
  textPrimary: '#1f2328',   // Quase preto para nitidez máxima
  textSecondary: '#656d76', // Cinza com contraste testado para acessibilidade
  success: '#2da44e',       // Verde com saturação ajustada
  warning: '#bf8700',       // Ocre/Amarelo escuro (distinguível de verde e vermelho por brilho)
  danger: '#cf222e',        // Vermelho intenso
  link: '#0969da',          // Azul de link clássico e acessível
};

export const temas = {
  padrao: themePadrao,
  colorblind: themeColorblind,
};

export type { Theme };