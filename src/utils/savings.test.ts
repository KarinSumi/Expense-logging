import { describe, it, expect } from 'vitest';
import { calculateSavingsProgress, calculateSavingsForecast } from './savings';

describe('Savings goals calculations', () => {
  it('should calculate progress correctly when savings are positive and below target', () => {
    const progress = calculateSavingsProgress(30000, 25000, 10000);
    expect(progress.savings).toBe(5000);
    expect(progress.target).toBe(10000);
    expect(progress.percentage).toBe(50);
    expect(progress.status).toBe('warning');
  });

  it('should return success status when savings reach or exceed target', () => {
    const progress = calculateSavingsProgress(35000, 20000, 10000);
    expect(progress.savings).toBe(15000);
    expect(progress.percentage).toBe(150);
    expect(progress.status).toBe('success');
  });

  it('should return critical status when savings are negative (losses)', () => {
    const progress = calculateSavingsProgress(20000, 25000, 5000);
    expect(progress.savings).toBe(-5000);
    expect(progress.percentage).toBe(0);
    expect(progress.status).toBe('critical');
  });

  it('should handle zero target gracefully', () => {
    const progress = calculateSavingsProgress(15000, 10000, 0);
    expect(progress.savings).toBe(5000);
    expect(progress.percentage).toBe(100);
    expect(progress.status).toBe('success');
  });

  describe('calculateSavingsForecast', () => {
    it('should calculate months required correctly for positive savings and valid target', () => {
      const forecast = calculateSavingsForecast(5000, 25000);
      expect(forecast.monthsRequired).toBe(5);
      expect(forecast.message).toContain('จะใช้เวลาประมาณ 5 เดือน');
    });

    it('should handle zero or negative savings correctly', () => {
      const forecastNegative = calculateSavingsForecast(-2000, 10000);
      expect(forecastNegative.monthsRequired).toBe(Infinity);
      expect(forecastNegative.message).toContain('กรุณาออมเงินให้มากกว่ารายจ่าย');

      const forecastZero = calculateSavingsForecast(0, 10000);
      expect(forecastZero.monthsRequired).toBe(Infinity);
    });

    it('should return 0 months if current savings is already above target', () => {
      const forecastSuccess = calculateSavingsForecast(12000, 10000);
      expect(forecastSuccess.monthsRequired).toBe(0);
      expect(forecastSuccess.message).toContain('ยินดีด้วย! คุณบรรลุเป้าหมายการออมแล้ว');
    });
  });
});
