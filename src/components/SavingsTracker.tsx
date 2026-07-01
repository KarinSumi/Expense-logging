import React from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Flame } from 'lucide-react';
import { calculateSavingsProgress, calculateSavingsForecast } from '../utils/savings';

interface SavingsTrackerProps {
  totalIncome: number;
  totalExpense: number;
  savingsTarget: number;
}

export const SavingsTracker: React.FC<SavingsTrackerProps> = ({
  totalIncome,
  totalExpense,
  savingsTarget
}) => {
  const progress = calculateSavingsProgress(totalIncome, totalExpense, savingsTarget);
  const isLoss = progress.savings < 0;

  const forecastGoal = savingsTarget > 0 ? savingsTarget * 10 : 100000;
  const forecast = calculateSavingsForecast(progress.savings, forecastGoal);

  // Render status badge & text
  const renderStatusInfo = () => {
    switch (progress.status) {
      case 'success':
        return {
          color: 'text-emerald-500 dark:text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/20',
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          message: 'สุดยอดเลย! คุณออมเงินถึงเป้าหมายรายเดือนที่ตั้งไว้เรียบร้อยแล้ว รักษาวินัยต่อไปนะ! 🎉'
        };
      case 'critical':
        return {
          color: 'text-brand-error',
          bgColor: 'bg-brand-error/10 border-brand-error/20',
          icon: <AlertTriangle className="w-5 h-5 text-brand-error" />,
          message: 'แจ้งเตือน: ขณะนี้รายจ่ายรวมสูงกว่ารายรับแล้ว! ควรพิจารณาลดรายจ่ายส่วนที่ไม่จำเป็นลงนะ ⚠️'
        };
      case 'warning':
      default:
        return {
          color: 'text-brand-primary',
          bgColor: 'bg-brand-primary/10 border-brand-primary/20',
          icon: <Flame className="w-5 h-5 text-brand-primary animate-pulse" />,
          message: `กำลังเข้าใกล้เป้าหมาย! คุณต้องการเก็บเงินเพิ่มอีก ฿${(savingsTarget - progress.savings).toLocaleString()} เพื่อบรรลุเป้าหมายออมเงินเดือนนี้ 💪`
        };
    }
  };

  const statusInfo = renderStatusInfo();

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 border border-brand-primary/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-primary" />
          <div>
            <h3 className="text-sm font-semibold text-brand-on-surface">เป้าหมายการออมประจำเดือน</h3>
            <p className="text-[11px] text-brand-on-surface-variant">วางแผนออมเงินเพื่ออนาคตที่มั่นคง</p>
          </div>
        </div>
        <span className="text-[10px] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2.5 py-1 rounded-full font-bold">
          เป้าหมายเดือนนี้: ฿{savingsTarget.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Progress Bar Area */}
        <div className="w-full md:w-2/3 space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-brand-on-surface-variant font-medium">เงินออมสะสมเดือนนี้</p>
              <p className={`text-2xl font-bold mt-1 ${isLoss ? 'text-brand-error' : 'text-emerald-600 dark:text-emerald-400'}`}>
                ฿{progress.savings.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-black ${statusInfo.color}`}>
                {progress.percentage}%
              </span>
              <p className="text-[10px] text-brand-on-surface-variant">ของเป้าหมาย</p>
            </div>
          </div>

          {/* Progress bar background */}
          <div className="w-full bg-brand-surface border border-brand-primary/10 h-3.5 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                progress.status === 'success'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : progress.status === 'critical'
                  ? 'bg-brand-error shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                  : 'bg-gradient-to-r from-brand-primary to-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.3)]'
              }`}
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Right Info Box */}
        <div className="w-full md:w-1/3">
          <div className="glass-panel rounded-xl p-4 border border-brand-primary/10 bg-brand-surface/20 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-brand-on-surface">วิเคราะห์แผนการออมสะสม</span>
            </div>
            <p className="text-[10px] text-brand-on-surface-variant leading-relaxed space-y-1">
              <span>เป้าหมายเงินสำรองฉุกเฉิน (10 เท่าของเป้าหมาย): </span>
              <span className="font-bold text-brand-on-surface">฿{forecastGoal.toLocaleString()}</span>
              <br />
              <span className="mt-1 block font-semibold text-brand-primary">{forecast.message}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Motivational / Status Alert Banner */}
      <div className={`mt-4 p-3 rounded-xl border flex items-start gap-3 ${statusInfo.bgColor} transition-all duration-300`}>
        <div className="mt-0.5 shrink-0">
          {statusInfo.icon}
        </div>
        <p className="text-xs leading-relaxed text-brand-on-surface font-medium">
          {statusInfo.message}
        </p>
      </div>
    </div>
  );
};
