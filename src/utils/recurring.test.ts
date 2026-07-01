import { describe, it, expect } from 'vitest';
import { Subscription, calculateTotalRecurringCost, getUpcomingBills, createTransactionFromSubscription, filterSubscriptions } from './recurring';

describe('Subscriptions and Recurring Bills helpers', () => {
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
      dueDate: 28,
      active: false // Inactive should be ignored
    }
  ];

  it('should calculate total monthly recurring costs accurately for active items', () => {
    const total = calculateTotalRecurringCost(mockSubscriptions);
    expect(total).toBe(1619); // 419 + 1200
  });

  it('should identify upcoming bills based on the current date of the month', () => {
    // If current day is June 10
    const mockCurrentDate = new Date('2026-06-10');
    const upcoming = getUpcomingBills(mockSubscriptions, mockCurrentDate);
    
    expect(upcoming).toHaveLength(2);
    // Netflix due on 15th (due in 5 days)
    expect(upcoming[0].id).toBe('sub-1');
    expect(upcoming[0].daysRemaining).toBe(5);
    // Adobe due on 5th next month (since June 5 passed)
    expect(upcoming[1].id).toBe('sub-2');
    expect(upcoming[1].daysRemaining).toBe(25); // June 10 to July 5 (30 days in June) -> 20 remaining in June + 5 in July = 25
  });

  it('should format a Subscription into a Transaction correctly', () => {
    const sub = mockSubscriptions[0];
    const tx = createTransactionFromSubscription(sub, 'custom-sub-tx-id');

    expect(tx.id).toBe('custom-sub-tx-id');
    expect(tx.description).toBe('Netflix Premium (รอบบิลประจำเดือน)');
    expect(tx.amount).toBe(419);
    expect(tx.category).toBe('ความบันเทิง');
    expect(tx.type).toBe('expense');
  });

  describe('filterSubscriptions', () => {
    it('should filter subscriptions by query correctly', () => {
      const result = filterSubscriptions(mockSubscriptions, 'adobe', 'all', 'all');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('sub-2');
    });

    it('should filter subscriptions by status correctly', () => {
      const activeOnly = filterSubscriptions(mockSubscriptions, '', 'all', 'active');
      expect(activeOnly).toHaveLength(2);

      const inactiveOnly = filterSubscriptions(mockSubscriptions, '', 'all', 'inactive');
      expect(inactiveOnly).toHaveLength(1);
      expect(inactiveOnly[0].id).toBe('sub-3');
    });

    it('should filter subscriptions by category correctly', () => {
      const res = filterSubscriptions(mockSubscriptions, '', 'การทำงาน', 'all');
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe('sub-2');
    });
  });
});
