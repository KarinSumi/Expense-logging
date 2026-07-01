import React from 'react';
import { motion } from 'motion/react';
import { CalendarRange, Sparkles, Receipt, RefreshCcw } from 'lucide-react';
import { Subscription } from '../utils/recurring';
import { RecurringBills } from './RecurringBills';
import { InsightsPanel } from './InsightsPanel';
import { BillsCalendar } from './BillsCalendar';
import { Transaction } from '../types';

interface RecurringTabProps {
  transactions: Transaction[];
  budgetLimit: number;
  totalIncome: number;
  totalExpense: number;
  subscriptions: Subscription[];
  onLogBill: (sub: Subscription) => void;
  onToggleActiveSubscription: (id: string) => void;
  onOpenSettings: () => void;
}

export const RecurringTab: React.FC<RecurringTabProps> = ({
  transactions,
  budgetLimit,
  totalIncome,
  totalExpense,
  subscriptions,
  onLogBill,
  onToggleActiveSubscription,
  onOpenSettings
}) => {
  return (
    <motion.div
      id="recurring-tab-viewport"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6 w-full"
    >
      {/* Tab Welcome / Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-brand-primary/15 via-brand-primary/5 to-transparent p-5 rounded-2xl border border-brand-primary/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-primary/20 text-brand-primary">
              <CalendarRange className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black font-headline text-brand-on-surface">บริการรายเดือน & การวิเคราะห์เชิงลึก</h2>
          </div>
          <p className="text-xs text-brand-on-surface-variant max-w-xl">
            วิเคราะห์พฤติกรรมการใช้เงินอย่างใกล้ชิดและควบคุมค่าบริการสตรีมมิ่ง/บิลสาธารณูปโภคประจำตัวของคุณอย่างเป็นระบบ
          </p>
        </div>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 bg-brand-surface text-brand-on-surface text-xs font-bold py-2 px-4 rounded-xl border border-brand-primary/15 hover:bg-brand-primary/5 transition-all self-start md:self-auto cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5 text-brand-primary animate-spin-slow" />
          แก้ไขบริการสมาชิก
        </button>
      </div>

      {/* Grid Layout for adaptive sizing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8/12 on large screens, full width on small) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Bill Calendar Grid */}
          <BillsCalendar
            subscriptions={subscriptions}
            onLogBill={onLogBill}
          />

          {/* Subscriptions Cards List */}
          <RecurringBills
            subscriptions={subscriptions}
            onLogBill={onLogBill}
            onToggleActive={onToggleActiveSubscription}
            onOpenSettings={onOpenSettings}
          />
        </div>

        {/* Right Column (5/12 on large screens, full width on small) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Financial Insights & Smart Alerts card */}
          <div className="glass-panel p-1 rounded-2xl border border-brand-primary/10 bg-brand-surface/20">
            <div className="flex items-center gap-2 px-5 pt-5 pb-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-bold text-brand-on-surface">ระบบวิเคราะห์สุขภาพการเงิน</h3>
            </div>
            <InsightsPanel
              transactions={transactions}
              budgetLimit={budgetLimit}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
            />
          </div>

          {/* Quick tips & guidelines card */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-primary/10 bg-brand-surface/20 space-y-3.5">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-primary" />
              <h4 className="text-xs font-black text-brand-on-surface uppercase tracking-wide">
                ข้อแนะนำในการจัดการค่าใช้จ่ายรายเดือน
              </h4>
            </div>
            
            <ul className="space-y-2.5 text-[11px] text-brand-on-surface-variant font-medium list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-brand-on-surface">ตรวจสอบความคุ้มค่า:</strong> ลองปิดการทำรายการบริการที่คุณไม่ได้ดูเกิน 2 สัปดาห์ เพื่อประหยัดเงินในหน้าจอนี้ได้ทันที
              </li>
              <li>
                <strong className="text-brand-on-surface">จ่ายทันทีเพื่อประวัติที่ดี:</strong> การบันทึกบิลชำระด้วยปุ่ม <strong className="text-brand-primary">"จ่ายบิล"</strong> จะบันทึกรายการธุรกรรมลงในบัญชีทันทีเพื่อรักษาสถิติการใช้เงินที่เที่ยงตรง
              </li>
              <li>
                <strong className="text-brand-on-surface">ตั้งบิลแจ้งเตือนล่วงหน้า:</strong> เมื่อกำหนดวันจ่ายเงินระบบจะอัปเดตสถานะในปฏิทินแบบเรียลไทม์
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default RecurringTab;
