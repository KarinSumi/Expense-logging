import { describe, it, expect } from 'vitest';
import { getInitialTheme, toggleThemeValue } from './theme';

describe('Theme utilities', () => {
  it('should return saved theme if valid', () => {
    expect(getInitialTheme('light')).toBe('light');
    expect(getInitialTheme('dark')).toBe('dark');
  });

  it('should default to dark if saved theme is missing or invalid', () => {
    expect(getInitialTheme(null)).toBe('dark');
    expect(getInitialTheme(undefined)).toBe('dark');
    expect(getInitialTheme('invalid-theme')).toBe('dark');
  });

  it('should toggle theme from light to dark', () => {
    expect(toggleThemeValue('light')).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    expect(toggleThemeValue('dark')).toBe('light');
  });
});
