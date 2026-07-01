import { Transaction } from '../types';

export interface FinancialInsight {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  description: string;
}

/**
 * Generates automated, data-driven financial advice and insights based on user transactions.
 */
export const generateInsights = (
  transactions: Transaction[],
  budgetLimit: number,
  totalIncome: number,
  totalExpense: number
): FinancialInsight[] => {
  const insights: FinancialInsight[] = [];

  // 1. Suggest adding income if total income is 0
  if (totalIncome === 0) {
    insights.push({
      id: 'no-income',
      type: 'info',
      title: 'เริ่มต้นบันทึกรายรับ',
      description: 'ระบบตรวจไม่พบรายรับในเดือนนี้ ลองเพิ่มเงินเดือนหรือรายได้เสริมเพื่อจำลองกระแสเงินสดของคุณ!'
    });
  }

  // 2. Budget proximity warning (expenses exceed 80% of budget)
  if (budgetLimit > 0) {
    const usagePercent = (totalExpense / budgetLimit) * 100;
    if (usagePercent >= 80) {
      insights.push({
        id: 'budget-warning',
        type: 'warning',
        title: 'ใกล้เตะเพดานงบประมาณ',
        description: `ระวัง! คุณใช้จ่ายสะสมไปแล้ว ${usagePercent.toFixed(0)}% ของวงเงินรายเดือนที่คุณตั้งไว้ ควรชะลอการซื้อของฟุ่มเฟือย`
      });
    }
  }

  // 3. Top category spending calculator
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length > 0) {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    let topCategory = '';
    let maxAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > maxAmount) {
        maxAmount = amt;
        topCategory = cat;
      }
    });

    if (topCategory && maxAmount > 0) {
      insights.push({
        id: 'top-category',
        type: 'info',
        title: 'หมวดหมู่ที่จ่ายหนักที่สุด',
        description: `คุณมียอดรายจ่ายสูงสุดในหมวด "${topCategory}" เป็นจำนวน ฿${maxAmount.toLocaleString()} ลองมองหาจุดที่ปรับลดลงได้เพื่อเพิ่มเงินออม!`
      });
    }
  }

  // 4. Savings rate checks (savings = income - expense)
  if (totalIncome > 0) {
    const savings = totalIncome - totalExpense;
    const savingsRate = (savings / totalIncome) * 100;
    
    if (savingsRate >= 30) {
      insights.push({
        id: 'high-savings',
        type: 'success',
        title: 'รักษาวินัยการออมยอดเยี่ยม',
        description: `ยอดเยี่ยม! คุณออมเงินได้ถึง ${savingsRate.toFixed(0)}% ของรายได้ทั้งหมดในเดือนนี้ แนะนำให้นำเงินส่วนนี้ไปลงทุนเพื่อเติบโตต่อไป!`
      });
    }
  }

  // 5. Subscription leakage detector (bills/subscriptions > 15% of income)
  if (totalIncome > 0) {
    const billExpenses = transactions
      .filter(t => t.type === 'expense' && (t.category === 'บิลและค่าใช้จ่าย' || /netflix|spotify|disney|youtube|premium|sub|membership/i.test(t.description)))
      .reduce((sum, t) => sum + t.amount, 0);

    const billPercent = (billExpenses / totalIncome) * 100;
    if (billPercent >= 15) {
      insights.push({
        id: 'subscription-warning',
        type: 'warning',
        title: 'เตือน: สัดส่วนค่าบริการรายเดือนสูง',
        description: `ค่าใช้จ่ายกลุ่มบิลและบริการรายเดือนสูงถึง ${billPercent.toFixed(0)}% ของรายรับทั้งหมด ควรวิเคราะห์และยกเลิกบริการที่ไม่ได้ใช้งาน`
      });
    }
  }

  // Default fallback insight if nothing else triggers
  if (insights.length === 0) {
    insights.push({
      id: 'welcome-insight',
      type: 'info',
      title: 'ความโปรดักทีฟทางการเงิน',
      description: 'เริ่มบันทึกธุรกรรมของคุณทุกวันเพื่อรับบทวิเคราะห์พฤติกรรมการใช้จ่ายและคำแนะนำการออมอัจฉริยะที่แม่นยำยิ่งขึ้น'
    });
  }

  return insights;
};
