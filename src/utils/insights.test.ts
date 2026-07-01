import { describe, it, expect } from 'vitest';
import { generateInsights, FinancialInsight } from './insights';
import { Transaction } from '../types';

describe('Financial Insights utility', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 'tx-1',
      type: 'expense',
      category: 'อาหารและเครื่องดื่ม',
      amount: 1500,
      date: '2026-06-01',
      time: '12:00',
      description: 'ดินเนอร์หรู'
    },
    {
      id: 'tx-2',
      type: 'expense',
      category: 'อาหารและเครื่องดื่ม',
      amount: 500,
      date: '2026-06-02',
      time: '08:00',
      description: 'อาหารเช้า'
    },
    {
      id: 'tx-3',
      type: 'expense',
      category: 'การเดินทาง',
      amount: 300,
      date: '2026-06-03',
      time: '09:00',
      description: 'ค่าแท็กซี่'
    }
  ];

  it('should generate critical warning if expenses exceed 80% of the budget limit', () => {
    const insights = generateInsights(mockTransactions, 2000, 5000, 2300);
    const budgetWarning = insights.find(ins => ins.id === 'budget-warning');
    expect(budgetWarning).toBeDefined();
    expect(budgetWarning?.type).toBe('warning');
    expect(budgetWarning?.description).toContain('ระวัง! คุณใช้จ่ายสะสมไปแล้ว');
  });

  it('should identify the top spending category correctly', () => {
    const insights = generateInsights(mockTransactions, 10000, 5000, 2300);
    const topCategoryInsight = insights.find(ins => ins.id === 'top-category');
    expect(topCategoryInsight).toBeDefined();
    expect(topCategoryInsight?.description).toContain('อาหารและเครื่องดื่ม');
  });

  it('should congratulate when savings rate is high', () => {
    // 5000 income, 1000 expense -> 4000 savings (80% savings rate)
    const insights = generateInsights(mockTransactions, 10000, 5000, 1000);
    const highSavings = insights.find(ins => ins.id === 'high-savings');
    expect(highSavings).toBeDefined();
    expect(highSavings?.type).toBe('success');
  });

  it('should suggest adding an income if total income is zero', () => {
    const insights = generateInsights(mockTransactions, 10000, 0, 1000);
    const noIncome = insights.find(ins => ins.id === 'no-income');
    expect(noIncome).toBeDefined();
    expect(noIncome?.type).toBe('info');
  });

  it('should generate warning if subscription/bill expenses exceed 15% of income', () => {
    const billTransactions: Transaction[] = [
      {
        id: 'tx-bill-1',
        type: 'expense',
        category: 'บิลและค่าใช้จ่าย',
        amount: 3000,
        date: '2026-06-01',
        time: '12:00',
        description: 'Netflix and Chill'
      },
      ...mockTransactions
    ];
    // Total income is 10000. 3000 is 30% of income, which exceeds 15%
    const insights = generateInsights(billTransactions, 10000, 10000, 5300);
    const subWarning = insights.find(ins => ins.id === 'subscription-warning');
    expect(subWarning).toBeDefined();
    expect(subWarning?.type).toBe('warning');
    expect(subWarning?.description).toContain('ค่าใช้จ่ายกลุ่มบิลและบริการรายเดือนสูงถึง');
  });
});
