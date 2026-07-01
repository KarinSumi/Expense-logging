export interface SavingsProgress {
  savings: number;
  target: number;
  percentage: number;
  status: 'critical' | 'warning' | 'success';
}

/**
 * Calculates monthly savings, target progress percentage, and financial health status.
 */
export const calculateSavingsProgress = (
  totalIncome: number,
  totalExpense: number,
  target: number
): SavingsProgress => {
  const savings = totalIncome - totalExpense;
  
  if (target <= 0) {
    return {
      savings,
      target: 0,
      percentage: 100,
      status: 'success'
    };
  }

  const percentageRaw = (savings / target) * 100;
  const percentage = Math.max(0, Math.min(percentageRaw, 999.9)); // Keep within reasonable bounds

  let status: 'critical' | 'warning' | 'success' = 'warning';
  if (savings < 0) {
    status = 'critical';
  } else if (savings >= target) {
    status = 'success';
  }

  return {
    savings,
    target,
    percentage: parseFloat(percentage.toFixed(1)),
    status
  };
};

export interface SavingsForecast {
  monthsRequired: number;
  message: string;
}

/**
 * Calculates the number of months required to reach a long-term savings goal
 * based on the user's monthly savings rate.
 */
export const calculateSavingsForecast = (
  currentSavings: number,
  target: number
): SavingsForecast => {
  if (currentSavings >= target) {
    return {
      monthsRequired: 0,
      message: 'ยินดีด้วย! คุณบรรลุเป้าหมายการออมแล้วในเดือนนี้ 🌟'
    };
  }

  if (currentSavings <= 0) {
    return {
      monthsRequired: Infinity,
      message: 'กรุณาออมเงินให้มากกว่ารายจ่ายเพื่อคำนวณระยะเวลาบรรลุเป้าหมาย 💡'
    };
  }

  const monthsRequired = Math.ceil(target / currentSavings);
  return {
    monthsRequired,
    message: `ด้วยความเร็วในการเก็บออมของเดือนนี้ คุณจะใช้เวลาประมาณ ${monthsRequired} เดือนเพื่อบรรลุเป้าหมาย 🚀`
  };
};
