import { Transaction } from '../types';

export interface PresetTemplate {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

const DEFAULT_PRESETS: PresetTemplate[] = [
  {
    id: 'p-1',
    description: 'ข้าวราดแกง',
    amount: 60,
    category: 'อาหารและเครื่องดื่ม',
    type: 'expense'
  },
  {
    id: 'p-2',
    description: 'กาแฟเย็นสด',
    amount: 70,
    category: 'อาหารและเครื่องดื่ม',
    type: 'expense'
  },
  {
    id: 'p-3',
    description: 'ค่ารถไฟฟ้า BTS',
    amount: 45,
    category: 'การเดินทาง',
    type: 'expense'
  },
  {
    id: 'p-4',
    description: 'วินมอเตอร์ไซค์',
    amount: 30,
    category: 'การเดินทาง',
    type: 'expense'
  },
  {
    id: 'p-5',
    description: 'สตรีมมิ่งรายเดือน',
    amount: 299,
    category: 'ความบันเทิง',
    type: 'expense'
  },
  {
    id: 'p-6',
    description: 'ของใช้ในบ้าน',
    amount: 450,
    category: 'ช้อปปิ้ง',
    type: 'expense'
  },
  {
    id: 'p-7',
    description: 'เงินเดือนสะสม',
    amount: 30000,
    category: 'รายได้จากงาน',
    type: 'income'
  },
  {
    id: 'p-8',
    description: 'รับจ้างอิสระ/เสริม',
    amount: 1500,
    category: 'รายได้เสริมอื่นๆ',
    type: 'income'
  }
];

export const getPresets = (): PresetTemplate[] => {
  return DEFAULT_PRESETS;
};

/**
 * Validates whether a preset template object has all required fields and valid constraints.
 */
export const validatePreset = (preset: Partial<PresetTemplate>): boolean => {
  if (!preset.description || preset.description.trim() === '') return false;
  if (preset.amount === undefined || preset.amount === null || isNaN(preset.amount) || preset.amount < 0) return false;
  if (!preset.category || preset.category.trim() === '') return false;
  if (preset.type !== 'income' && preset.type !== 'expense') return false;
  return true;
};

/**
 * Adds a new custom preset template with a uniquely generated ID.
 */
export const addCustomPreset = (
  presetList: PresetTemplate[],
  newPreset: Omit<PresetTemplate, 'id'>
): PresetTemplate[] => {
  const customId = `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const preset: PresetTemplate = {
    id: customId,
    ...newPreset
  };
  return [...presetList, preset];
};

/**
 * Removes a custom preset template from the list by its ID.
 */
export const deleteCustomPreset = (
  presetList: PresetTemplate[],
  id: string
): PresetTemplate[] => {
  return presetList.filter(preset => preset.id !== id);
};

export const createTransactionFromPreset = (
  preset: PresetTemplate,
  customId?: string
): Transaction => {
  const now = new Date();
  
  // Format local date YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${date}`;
  
  // Format local time HH:MM
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  return {
    id: customId || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: preset.type,
    category: preset.category,
    amount: preset.amount,
    date: formattedDate,
    time: formattedTime,
    description: preset.description
  };
};
