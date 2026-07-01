import { Transaction } from '../types';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  billingCycle: 'monthly';
  dueDate: number; // Day of month (1-31)
  active: boolean;
}

export interface UpcomingBill extends Subscription {
  daysRemaining: number;
  formattedDueDate: string;
}

/**
 * Calculates total active monthly subscription expenses.
 */
export const calculateTotalRecurringCost = (subscriptions: Subscription[]): number => {
  return subscriptions
    .filter(sub => sub.active)
    .reduce((sum, sub) => sum + sub.amount, 0);
};

/**
 * Determines days remaining until each subscription's next due date.
 */
export const getUpcomingBills = (
  subscriptions: Subscription[],
  currentDateInput?: Date
): UpcomingBill[] => {
  const now = currentDateInput || new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  const activeSubs = subscriptions.filter(sub => sub.active);

  return activeSubs.map(sub => {
    let daysRemaining = 0;
    
    // Simple robust calendar-based diffing
    const dueThisMonth = new Date(currentYear, currentMonth, sub.dueDate);
    const dueNextMonth = new Date(currentYear, currentMonth + 1, sub.dueDate);

    // If day of month is passed, the next bill is next month
    if (currentDay <= sub.dueDate) {
      const diffTime = Math.abs(dueThisMonth.getTime() - now.getTime());
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // Fix potential rounding edge case at exact midnight
      if (currentDay === sub.dueDate) daysRemaining = 0;
    } else {
      const diffTime = Math.abs(dueNextMonth.getTime() - now.getTime());
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      ...sub,
      daysRemaining,
      formattedDueDate: `ทุกวันที่ ${sub.dueDate} ของเดือน`
    };
  }).sort((a, b) => a.daysRemaining - b.daysRemaining);
};

/**
 * Transforms a subscription item into a standard transaction record when "paid".
 */
export const createTransactionFromSubscription = (
  subscription: Subscription,
  customId?: string
): Transaction => {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${date}`;
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  return {
    id: customId || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'expense',
    category: subscription.category,
    amount: subscription.amount,
    date: formattedDate,
    time: formattedTime,
    description: `${subscription.name} (รอบบิลประจำเดือน)`
  };
};

/**
 * Returns default list of user subscriptions
 */
export const getInitialSubscriptions = (): Subscription[] => [
  {
    id: 'sub-def-1',
    name: 'Netflix Premium',
    amount: 419,
    category: 'ความบันเทิง',
    billingCycle: 'monthly',
    dueDate: 15,
    active: true
  },
  {
    id: 'sub-def-2',
    name: 'Spotify Family',
    amount: 209,
    category: 'ความบันเทิง',
    billingCycle: 'monthly',
    dueDate: 28,
    active: true
  },
  {
    id: 'sub-def-3',
    name: 'บิลค่าโทรศัพท์ / อินเทอร์เน็ต',
    amount: 699,
    category: 'บิลและค่าสาธารณูปโภค',
    billingCycle: 'monthly',
    dueDate: 5,
    active: true
  }
];

/**
 * Filters a list of subscriptions based on search, category, and status.
 */
export const filterSubscriptions = (
  subscriptions: Subscription[],
  query: string,
  category: string,
  status: 'all' | 'active' | 'inactive'
): Subscription[] => {
  return subscriptions.filter(sub => {
    // Search query match
    const matchesQuery = !query || sub.name.toLowerCase().includes(query.toLowerCase()) || sub.category.toLowerCase().includes(query.toLowerCase());
    
    // Category match
    const matchesCategory = category === 'all' || sub.category === category;
    
    // Status match
    const matchesStatus = 
      status === 'all' || 
      (status === 'active' && sub.active) || 
      (status === 'inactive' && !sub.active);
      
    return matchesQuery && matchesCategory && matchesStatus;
  });
};

