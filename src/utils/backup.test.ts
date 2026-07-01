import { describe, it, expect } from 'vitest';
import { exportTransactionsToJSON, exportTransactionsToCSV, validateImportedJSON } from './backup';
import { Transaction } from '../types';

describe('Data Backup & Portability utilities', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 'tx-1',
      type: 'expense',
      category: 'อาหารและเครื่องดื่ม',
      amount: 150,
      date: '2026-06-01',
      time: '12:30',
      description: 'ข้าวผัดปู'
    },
    {
      id: 'tx-2',
      type: 'income',
      category: 'รายได้เสริมอื่นๆ',
      amount: 2500,
      date: '2026-06-02',
      time: '18:15',
      description: 'ขายของเล่นมือสอง'
    }
  ];

  it('should serialize transactions to valid JSON string', () => {
    const jsonStr = exportTransactionsToJSON(mockTransactions);
    expect(typeof jsonStr).toBe('string');
    const parsed = JSON.parse(jsonStr);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].description).toBe('ข้าวผัดปู');
  });

  it('should serialize transactions to correct CSV string format with headers', () => {
    const csvStr = exportTransactionsToCSV(mockTransactions);
    expect(typeof csvStr).toBe('string');
    expect(csvStr).toContain('ID,Type,Category,Amount,Date,Time,Description');
    expect(csvStr).toContain('tx-1,expense,อาหารและเครื่องดื่ม,150,2026-06-01,12:30,"ข้าวผัดปู"');
    expect(csvStr).toContain('tx-2,income,รายได้เสริมอื่นๆ,2500,2026-06-02,18:15,"ขายของเล่นมือสอง"');
  });

  it('should successfully parse and validate a correct JSON backup string', () => {
    const validJSON = JSON.stringify(mockTransactions);
    const result = validateImportedJSON(validJSON);
    expect(result).toHaveLength(2);
    expect(result[1].id).toBe('tx-2');
  });

  it('should throw error when importing invalid JSON schema or corrupted string', () => {
    // Corrupted JSON string
    expect(() => validateImportedJSON('invalid json string{')).toThrow();

    // Invalid properties (missing amount)
    const invalidItems = [
      {
        id: 'tx-bad',
        type: 'expense',
        category: 'ช้อปปิ้ง',
        date: '2026-06-03',
        time: '12:00',
        description: 'missing amount field'
      }
    ];
    expect(() => validateImportedJSON(JSON.stringify(invalidItems))).toThrow('รูปแบบข้อมูลไม่ถูกต้อง');
  });
});
