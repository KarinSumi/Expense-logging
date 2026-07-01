import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  ArrowRightLeft, 
  TrendingDown 
} from 'lucide-react';
import { Transaction } from '../types';
import CategoryIcon from './CategoryIcon';
import { QuickPresets } from './QuickPresets';
import { PresetTemplate } from '../utils/presets';
import { SavingsTracker } from './SavingsTracker';

interface DashboardTabProps {
  currentBalance: number;
  totalExpense: number;
  budgetLimit: number;
  totalIncome: number;
  transactions: Transaction[];
  weeklyChartData: Array<{ day: string; income: number; expense: number }>;
  maxChartValue: number;
  setIsAddModalOpen: (open: boolean) => void;
  setIsTransferModalOpen: (open: boolean) => void;
  setActiveTab: (tab: 'dashboard' | 'transactions' | 'reports' | 'recurring') => void;
  setSearchQuery: (query: string) => void;
  formatThaiDate: (dateStr: string) => string;
  onSelectPreset: (preset: PresetTemplate) => void;
  savingsTarget: number;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  currentBalance,
  totalExpense,
  budgetLimit,
  totalIncome,
  transactions,
  weeklyChartData,
  maxChartValue,
  setIsAddModalOpen,
  setIsTransferModalOpen,
  setActiveTab,
  setSearchQuery,
  formatThaiDate,
  onSelectPreset,
  savingsTarget
}) => {
  return (
    <motion.div
      key="dashboard-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full"
    >
      {/* Left Column: Total Balance Card & Weekly bar chart */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        
        {/* Total Balance Card */}
        <div className="glass-elevated rounded-2xl p-6 md:p-8 relative overflow-hidden group border border-brand-primary/10">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-[60px] group-hover:bg-brand-primary/10 transition-colors duration-700 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <p className="text-brand-on-surface-variant text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-primary" />
                <span>ยอดเงินคงเหลือรวม</span>
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-on-surface tracking-tight">
                ฿ {currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.')[0]}
                <span className="text-brand-primary/70 text-2xl">.{currentBalance.toFixed(2).split('.')[1]}</span>
              </h2>
              
              {/* Budget Limit Tracker */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-brand-on-surface-variant">
                  <span>ความคืบหน้างบประมาณรายจ่ายเดือนนี้:</span>
                  <span className="font-semibold text-brand-primary">฿{totalExpense.toLocaleString()} / ฿{budgetLimit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-brand-surface rounded-full h-2 overflow-hidden border border-brand-primary/10">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      (totalExpense / budgetLimit) > 0.9 ? 'bg-brand-error' : 'bg-brand-primary'
                    }`}
                    style={{ width: `${Math.min((totalExpense / budgetLimit) * 100, 100)}%` }}
                  />
                </div>
                {totalExpense > budgetLimit && (
                  <div className="flex items-center gap-1.5 text-brand-error text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>คุณจ่ายเงินเกินงบประมาณรายเดือนที่ตั้งไว้แล้ว!</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-brand-primary mt-3 inline-flex items-center gap-1.5 bg-brand-primary/10 px-2.5 py-1 rounded border border-brand-primary/20">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.5% จากเดือนที่แล้ว</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                id="dash-add-btn"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-brand-primary/10 border border-brand-primary/30 text-brand-primary px-5 py-2.5 rounded-xl hover:bg-brand-primary/20 transition-all duration-300 flex items-center gap-2 font-medium text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่ม</span>
              </button>
              <button
                id="dash-transfer-btn"
                onClick={() => setIsTransferModalOpen(true)}
                className="bg-brand-surface border border-brand-primary/20 text-brand-on-surface px-5 py-2.5 rounded-xl hover:bg-brand-surface-variant/40 transition-colors flex items-center gap-2 font-medium text-sm cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>โอน</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Presets Section */}
        <QuickPresets onSelectPreset={onSelectPreset} />

        {/* Savings Goal Tracker */}
        <SavingsTracker totalIncome={totalIncome} totalExpense={totalExpense} savingsTarget={savingsTarget} />

        {/* Income vs Expenses Weekly Chart Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-[360px] relative border border-brand-primary/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-brand-on-surface">รายรับ vs รายจ่าย (สัปดาห์นี้)</h3>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(125,211,252,0.5)]" />
                <span className="text-brand-on-surface-variant">รายรับ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-error shadow-[0_0_8px_rgba(255,107,107,0.5)]" />
                <span className="text-brand-on-surface-variant">รายจ่าย</span>
              </div>
            </div>
          </div>

          {/* Chart visual representation */}
          <div className="relative flex-1 flex items-end gap-1.5 md:gap-4 pb-6 w-full h-[200px]">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 z-0">
              <div className="w-full border-t border-brand-primary/5 h-0" />
              <div className="w-full border-t border-brand-primary/5 h-0" />
              <div className="w-full border-t border-brand-primary/5 h-0" />
              <div className="w-full border-t border-brand-primary/15 h-0" />
            </div>

            {/* Mon - Sun Bars */}
            {weeklyChartData.map((d, index) => {
              const incPercent = (d.income / maxChartValue) * 100;
              const expPercent = (d.expense / maxChartValue) * 100;

              return (
                <div key={index} className="flex-1 flex items-end justify-center gap-1 h-full relative z-10">
                  {/* Income Bar */}
                  <div 
                    className="w-2 md:w-3.5 bg-gradient-to-t from-brand-primary/10 to-brand-primary rounded-t-sm shadow-[0_0_10px_rgba(125,211,252,0.2)] transition-all duration-700 ease-out hover:brightness-110 cursor-pointer group"
                    style={{ height: `${Math.max(incPercent, 4)}%` }}
                    title={`รายรับ: ฿${d.income.toLocaleString()}`}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-surface border border-brand-primary/30 px-2 py-1 rounded text-[10px] hidden group-hover:block whitespace-nowrap z-20 pointer-events-none text-brand-on-surface shadow-sm">
                      ฿{d.income.toLocaleString()}
                    </div>
                  </div>
                  {/* Expense Bar */}
                  <div 
                    className="w-2 md:w-3.5 bg-gradient-to-t from-brand-error/10 to-brand-error rounded-t-sm shadow-[0_0_10px_rgba(255,107,107,0.2)] transition-all duration-700 ease-out hover:brightness-110 cursor-pointer group"
                    style={{ height: `${Math.max(expPercent, 4)}%` }}
                    title={`รายจ่าย: ฿${d.expense.toLocaleString()}`}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-surface border border-brand-error/30 px-2 py-1 rounded text-[10px] hidden group-hover:block whitespace-nowrap z-20 pointer-events-none text-brand-on-surface shadow-sm">
                      ฿{d.expense.toLocaleString()}
                    </div>
                  </div>
                  <span className="absolute bottom-[-22px] font-sans text-xs text-brand-on-surface-variant w-full text-center">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Bento Stats & Recent Transactions List */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        
        {/* Monthly Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel rounded-xl p-4 border-t-2 border-t-brand-primary flex flex-col justify-between border border-brand-primary/10">
            <p className="text-xs text-brand-on-surface-variant font-medium">รายรับเดือนนี้</p>
            <p className="text-xl font-bold text-brand-primary mt-2">฿ {totalIncome.toLocaleString()}</p>
          </div>
          <div className="glass-panel rounded-xl p-4 border-t-2 border-t-brand-error flex flex-col justify-between border border-brand-primary/10">
            <p className="text-xs text-brand-on-surface-variant font-medium">รายจ่ายเดือนนี้</p>
            <p className="text-xl font-bold text-brand-error mt-2">฿ {totalExpense.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden min-h-[350px] border border-brand-primary/10">
          <div className="p-5 border-b border-brand-primary/10 flex justify-between items-center bg-brand-surface-container/30">
            <h3 className="text-base font-semibold text-brand-on-surface">รายการล่าสุด</h3>
            <button 
              onClick={() => setActiveTab('transactions')}
              className="text-xs text-brand-primary hover:underline font-medium transition-colors cursor-pointer"
            >
              ดูทั้งหมด
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-brand-primary/5 p-2">
            {transactions.slice(0, 4).map((t) => (
              <div 
                key={t.id}
                onClick={() => {
                  setSearchQuery(t.description);
                  setActiveTab('transactions');
                }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-brand-surface-variant/20 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center border border-brand-primary/10 group-hover:border-brand-primary/30 transition-all flex-shrink-0">
                  <CategoryIcon iconName={t.category} className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-on-surface truncate">{t.description}</p>
                  <p className="text-xs text-brand-on-surface-variant mt-0.5">{formatThaiDate(t.date)}, {t.time}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${
                    t.type === 'income' ? 'text-brand-primary' : 'text-brand-error'
                  }`}>
                    {t.type === 'income' ? '+' : '-'} ฿{t.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-brand-on-surface-variant">
                <p className="text-sm">ไม่มีรายการธุรกรรมในขณะนี้</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs text-brand-primary underline mt-2 cursor-pointer"
                >
                  เพิ่มรายการแรกของคุณ
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
export default DashboardTab;
