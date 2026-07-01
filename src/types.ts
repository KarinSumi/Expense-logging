export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  description: string;
}

export interface CategoryDetail {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}
