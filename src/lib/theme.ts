export const theme = {
  colors: {
    primary: '#04B431',
    primaryDark: '#038C26',
    secondary: '#FFD700',
    secondaryDark: '#E6C200',
    background: '#1a1a2e',
    backgroundLight: '#16213e',
    backgroundCard: '#0f3460',
    surface: '#1f2937',
    surfaceLight: '#374151',
    text: '#ffffff',
    textMuted: '#9ca3af',
    textDark: '#6b7280',
    danger: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  fonts: {
    heading: "'Arial Black', 'Arial Bold', sans-serif",
    body: "'Arial', 'Helvetica Neue', sans-serif",
  },
} as const;

export type Theme = typeof theme;
