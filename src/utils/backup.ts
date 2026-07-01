import { Transaction } from '../types';

/**
 * Serializes transaction data to pretty formatted JSON.
 */
export const exportTransactionsToJSON = (transactions: Transaction[]): string => {
  return JSON.stringify(transactions, null, 2);
};

/**
 * Serializes transaction data to standard CSV formatted string.
 * Prepends BOM character so Excel/Numbers can parse Thai characters correctly.
 */
export const exportTransactionsToCSV = (transactions: Transaction[]): string => {
  const headers = ['ID', 'Type', 'Category', 'Amount', 'Date', 'Time', 'Description'];
  const rows = transactions.map(tx => [
    tx.id,
    tx.type,
    tx.category,
    tx.amount.toString(),
    tx.date,
    tx.time,
    // Escape quotes and wrap description with quotes if needed
    `"${tx.description.replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Validates and parses the imported JSON backup.
 * Throws an Error if schema is invalid or structure is mismatched.
 */
export const validateImportedJSON = (jsonString: string): Transaction[] => {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error('ไม่สามารถแปลงไฟล์ JSON ได้ กรุณาตรวจสอบว่าไฟล์ถูกต้องและไม่มีสัญลักษณ์เสีย');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('รูปแบบข้อมูลไม่ถูกต้อง: ข้อมูลแบ็กอัพควรเป็นรายการอาร์เรย์ (Array) ของธุรกรรม');
  }

  // Validate each item
  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i];
    
    // Core fields check
    if (
      typeof item.id !== 'string' ||
      (item.type !== 'income' && item.type !== 'expense') ||
      typeof item.category !== 'string' ||
      typeof item.amount !== 'number' ||
      isNaN(item.amount) ||
      typeof item.date !== 'string' ||
      typeof item.time !== 'string' ||
      typeof item.description !== 'string'
    ) {
      throw new Error(`รูปแบบข้อมูลไม่ถูกต้องในรายการที่ ${i + 1}: กรุณาตรวจสอบสคีมาของข้อมูลธุรกรรม`);
    }
  }

  return parsed as Transaction[];
};
