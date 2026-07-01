export type Theme = 'light' | 'dark';

/**
 * Returns the initial theme based on the saved state or defaults to 'dark'.
 */
export const getInitialTheme = (savedTheme?: string | null): Theme => {
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return 'dark'; // Default to dark (night) theme
};

/**
 * Toggles the theme value.
 */
export const toggleThemeValue = (currentTheme: Theme): Theme => {
  return currentTheme === 'light' ? 'dark' : 'light';
};
