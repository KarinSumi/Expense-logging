import { describe, it, expect } from 'vitest';
import { getPresets, createTransactionFromPreset, PresetTemplate, validatePreset, addCustomPreset, deleteCustomPreset } from './presets';

describe('Preset templates utility', () => {
  it('should return a non-empty list of preset templates', () => {
    const presets = getPresets();
    expect(presets.length).toBeGreaterThan(0);
    expect(presets[0]).toHaveProperty('id');
    expect(presets[0]).toHaveProperty('description');
    expect(presets[0]).toHaveProperty('amount');
    expect(presets[0]).toHaveProperty('category');
    expect(presets[0]).toHaveProperty('type');
  });

  it('should successfully create a Transaction from a PresetTemplate', () => {
    const mockPreset: PresetTemplate = {
      id: 'p-1',
      description: 'ข้าวราดแกง',
      amount: 60,
      category: 'อาหารและเครื่องดื่ม',
      type: 'expense'
    };

    const transaction = createTransactionFromPreset(mockPreset, 'custom-id-123');

    expect(transaction.id).toBe('custom-id-123');
    expect(transaction.description).toBe('ข้าวราดแกง');
    expect(transaction.amount).toBe(60);
    expect(transaction.category).toBe('อาหารและเครื่องดื่ม');
    expect(transaction.type).toBe('expense');
    
    // Validate date format (YYYY-MM-DD)
    expect(transaction.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    
    // Validate time format (HH:MM)
    expect(transaction.time).toMatch(/^\d{2}:\d{2}$/);
  });

  it('should successfully add a preset transaction to an existing transaction list', () => {
    const list: any[] = [];
    const mockPreset: PresetTemplate = {
      id: 'p-1',
      description: 'ข้าวราดแกง',
      amount: 60,
      category: 'อาหารและเครื่องดื่ม',
      type: 'expense'
    };
    const newTx = createTransactionFromPreset(mockPreset, 'p-1-tx');
    const updatedList = [newTx, ...list];

    expect(updatedList.length).toBe(1);
    expect(updatedList[0].id).toBe('p-1-tx');
  });

  it('should validate presets correctly', () => {
    expect(validatePreset({ description: 'Test', amount: 100, category: 'Food', type: 'expense' })).toBe(true);
    expect(validatePreset({ description: '', amount: 100, category: 'Food', type: 'expense' })).toBe(false);
    expect(validatePreset({ description: 'Test', amount: -10, category: 'Food', type: 'expense' })).toBe(false);
    expect(validatePreset({ description: 'Test', amount: 100, category: '', type: 'expense' })).toBe(false);
  });

  it('should successfully add a custom preset with a unique ID', () => {
    const initialList: PresetTemplate[] = [];
    const newPreset = {
      description: 'ข้าวผัดหมู',
      amount: 70,
      category: 'อาหารและเครื่องดื่ม',
      type: 'expense' as const
    };

    const result = addCustomPreset(initialList, newPreset);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBeDefined();
    expect(result[0].description).toBe('ข้าวผัดหมู');
    expect(result[0].amount).toBe(70);
  });

  it('should successfully delete a custom preset by ID', () => {
    const initialList: PresetTemplate[] = [
      { id: 'custom-1', description: 'ชานมไข่มุก', amount: 50, category: 'อาหารและเครื่องดื่ม', type: 'expense' },
      { id: 'custom-2', description: 'ค่ากาแฟ', amount: 60, category: 'อาหารและเครื่องดื่ม', type: 'expense' }
    ];

    const result = deleteCustomPreset(initialList, 'custom-1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('custom-2');
  });
});
