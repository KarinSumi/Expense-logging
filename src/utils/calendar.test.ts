import { describe, it, expect } from 'vitest';
import { generateCalendarGrid, CalendarDay } from './calendar';
import { Subscription } from './recurring';

describe('Calendar Utility for Recurring Bills', () => {
  const mockSubscriptions: Subscription[] = [
    {
      id: 'sub-1',
      name: 'Netflix Premium',
      amount: 419,
      category: 'ความบันเทิง',
      billingCycle: 'monthly',
      dueDate: 15,
      active: true
    },
    {
      id: 'sub-2',
      name: 'Adobe Creative Cloud',
      amount: 1200,
      category: 'การทำงาน',
      billingCycle: 'monthly',
      dueDate: 5,
      active: true
    },
    {
      id: 'sub-3',
      name: 'Gym Membership',
      amount: 1500,
      category: 'สุขภาพและกีฬา',
      billingCycle: 'monthly',
      dueDate: 15,
      active: false // Inactive subscription
    }
  ];

  it('should generate a 42-day calendar grid for a given year and month (0-indexed)', () => {
    // June 2026 starts on Monday (1) and has 30 days.
    const grid = generateCalendarGrid(2026, 5, mockSubscriptions); // 5 is June
    expect(grid).toHaveLength(42);

    // June 1, 2026 check
    const june1 = grid.find(d => d.isCurrentMonth && d.dayNumber === 1);
    expect(june1).toBeDefined();
    expect(june1?.date.getDay()).toBe(1); // Monday
  });

  it('should correctly attach active subscriptions to the matching calendar day of the month', () => {
    const grid = generateCalendarGrid(2026, 5, mockSubscriptions); // June 2026

    // On the 5th day of the month, sub-2 (Adobe) should be attached
    const day5 = grid.find(d => d.isCurrentMonth && d.dayNumber === 5);
    expect(day5).toBeDefined();
    expect(day5?.bills).toHaveLength(1);
    expect(day5?.bills[0].id).toBe('sub-2');

    // On the 15th day of the month, sub-1 (Netflix) should be attached
    const day15 = grid.find(d => d.isCurrentMonth && d.dayNumber === 15);
    expect(day15).toBeDefined();
    // Only active subscriptions should show up, so sub-3 should be ignored!
    expect(day15?.bills).toHaveLength(1);
    expect(day15?.bills[0].id).toBe('sub-1');
  });

  it('should handle months with fewer than 31 days correctly and not attach bills to out-of-bounds dates', () => {
    // February 2026 has 28 days
    const grid = generateCalendarGrid(2026, 1, mockSubscriptions); // 1 is February
    const feb29 = grid.find(d => d.isCurrentMonth && d.dayNumber === 29);
    expect(feb29).toBeUndefined();
  });
});
