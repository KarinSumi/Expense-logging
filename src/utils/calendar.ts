import { Subscription } from './recurring';

export interface CalendarDay {
  date: Date;
  dayNumber: number; // 1-31
  isCurrentMonth: boolean;
  bills: Subscription[];
}

/**
 * Generates a 42-day calendar grid (6 weeks x 7 days) starting on Sunday.
 * Automatically maps active subscriptions/recurring bills due on each day.
 */
export const generateCalendarGrid = (
  year: number,
  month: number, // 0-indexed (0 is January, 11 is December)
  subscriptions: Subscription[]
): CalendarDay[] => {
  const grid: CalendarDay[] = [];
  
  // Find the first day of the specified month
  const firstDayOfMonth = new Date(year, month, 1);
  
  // Sunday-based grid starting offset (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = firstDayOfMonth.getDay();
  
  // Backtrack to the nearest Sunday before the 1st of the month
  const startDate = new Date(year, month, 1 - startDayOfWeek);

  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    const isCurrentMonth = currentDate.getMonth() === month;
    const dayNumber = currentDate.getDate();

    // Match subscriptions due on this calendar date
    // Only match if it's the current month (or if we want to preview recurring cycles)
    const bills = isCurrentMonth
      ? subscriptions.filter(sub => sub.active && sub.dueDate === dayNumber)
      : [];

    grid.push({
      date: currentDate,
      dayNumber,
      isCurrentMonth,
      bills
    });
  }

  return grid;
};
