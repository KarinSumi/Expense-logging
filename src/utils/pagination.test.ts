import { describe, it, expect } from 'vitest';
import { paginateList, filterList, sortList } from './pagination';

describe('Pagination and Filtering Utilities', () => {
  const mockItems = [
    { id: '1', name: 'Netflix', amount: 419, type: 'expense', date: '2026-06-15' },
    { id: '2', name: 'Salary', amount: 50000, type: 'income', date: '2026-06-01' },
    { id: '3', name: 'Adobe', amount: 1200, type: 'expense', date: '2026-06-05' },
    { id: '4', name: 'Bonus', amount: 10000, type: 'income', date: '2026-06-25' },
    { id: '5', name: 'Groceries', amount: 800, type: 'expense', date: '2026-06-10' },
  ];

  describe('paginateList', () => {
    it('should paginate items correctly for page 1', () => {
      const result = paginateList(mockItems, 1, 2);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).toBe('1');
      expect(result.items[1].id).toBe('2');
      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(1);
    });

    it('should paginate items correctly for the last page', () => {
      const result = paginateList(mockItems, 3, 2);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('5');
      expect(result.currentPage).toBe(3);
    });

    it('should normalize current page if it is out of bounds', () => {
      const resultTooHigh = paginateList(mockItems, 5, 2);
      expect(resultTooHigh.currentPage).toBe(3);

      const resultTooLow = paginateList(mockItems, -1, 2);
      expect(resultTooLow.currentPage).toBe(1);
    });
  });

  describe('filterList', () => {
    it('should filter items by search query', () => {
      const result = filterList(mockItems, 'dob', (item) => item.name);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Adobe');
    });

    it('should return all items when query is empty', () => {
      const result = filterList(mockItems, '', (item) => item.name);
      expect(result).toHaveLength(5);
    });
  });

  describe('sortList', () => {
    it('should sort items by amount descending', () => {
      const result = sortList(mockItems, 'amount', 'desc');
      expect(result[0].amount).toBe(50000);
      expect(result[4].amount).toBe(419);
    });

    it('should sort items by date ascending', () => {
      const result = sortList(mockItems, 'date', 'asc');
      expect(result[0].date).toBe('2026-06-01');
      expect(result[4].date).toBe('2026-06-25');
    });
  });
});
