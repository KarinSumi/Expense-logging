import React from 'react';
import { Lightbulb, Info, AlertTriangle, CheckCircle, Award } from 'lucide-react';
import { generateInsights, FinancialInsight } from '../utils/insights';
import { Transaction } from '../types';

interface InsightsPanelProps {
  transactions: Transaction[];
  budgetLimit: number;
  totalIncome: number;
  totalExpense: number;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  transactions,
  budgetLimit,
  totalIncome,
  totalExpense
}) => {
  const insights = generateInsights(transactions, budgetLimit, totalIncome, totalExpense);

  const getInsightIcon = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-brand-error shrink-0" />;
      case 'success':
        return <Award className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />;
      case 'info':
      default:
        return <Lightbulb className="w-5 h-5 text-brand-primary shrink-0" />;
    }
  };

  const getInsightStyles = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-brand-error/10 border-brand-error/20 text-brand-on-surface';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20 text-brand-on-surface';
      case 'info':
      default:
        return 'bg-brand-primary/10 border-brand-primary/20 text-brand-on-surface';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 border border-brand-primary/10">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-brand-primary animate-pulse" />
        <div>
          <h3 className="text-sm font-semibold text-brand-on-surface">วิเคราะห์การเงินส่วนตัวอัจฉริยะ</h3>
          <p className="text-[11px] text-brand-on-surface-variant">ข้อมูลเชิงลึกและคำแนะนำเพื่อพฤติกรรมทางการเงินที่ดีขึ้น</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`flex items-start gap-3.5 p-4 rounded-xl border ${getInsightStyles(insight.type)} transition-all duration-300 hover:scale-[1.01]`}
          >
            <div className="p-1.5 rounded-lg bg-brand-surface border border-brand-primary/5 shadow-sm">
              {getInsightIcon(insight.type)}
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-xs font-bold text-brand-on-surface">
                {insight.title}
              </h4>
              <p className="text-xs text-brand-on-surface-variant leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
