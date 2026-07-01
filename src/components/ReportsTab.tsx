import React from 'react';
import { motion } from 'motion/react';
import { PieChart as PieChartIcon, TrendingDown } from 'lucide-react';
import { CategoryDetail } from '../types';

interface DonutSegment extends CategoryDetail {
  startPercent: number;
  endPercent: number;
}

interface ReportsTabProps {
  reportTimeRange: 'daily' | 'weekly' | 'monthly' | 'yearly';
  setReportTimeRange: (range: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  totalExpense: number;
  categoryDetails: CategoryDetail[];
  donutSegments: DonutSegment[];
  highlightedCategory: string | null;
  setHighlightedCategory: (category: string | null) => void;
  setFilterCategory: (category: string) => void;
  setActiveTab: (tab: 'dashboard' | 'transactions' | 'reports') => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  reportTimeRange,
  setReportTimeRange,
  totalExpense,
  categoryDetails,
  donutSegments,
  highlightedCategory,
  setHighlightedCategory,
  setFilterCategory,
  setActiveTab
}) => {
  return (
    <motion.div
      key="reports-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-8"
    >
      {/* Header & Filter Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline text-brand-on-surface">รายงานการเงิน</h1>
          <p className="text-brand-on-surface-variant text-xs mt-1">สัดส่วนและภาพรวมค่าใช้จ่ายของคุณทั้งหมด</p>
        </div>

        {/* Glassmorphism style range filters */}
        <div className="flex bg-brand-surface p-1 rounded-xl border border-brand-primary/20">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((range) => {
            const label = range === 'daily' ? 'รายวัน' : range === 'weekly' ? 'รายสัปดาห์' : range === 'monthly' ? 'รายเดือน' : 'รายปี';
            return (
              <button
                key={range}
                onClick={() => setReportTimeRange(range)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  reportTimeRange === range
                    ? 'bg-brand-primary text-brand-background font-semibold shadow-sm'
                    : 'text-brand-on-surface-variant hover:text-brand-on-surface'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Summary Card and detail list */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Expense Summary card */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-brand-primary/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <PieChartIcon className="text-brand-primary w-5 h-5" />
                <h3 className="text-brand-on-surface-variant text-sm font-medium">
                  รายจ่ายทั้งหมด ({reportTimeRange === 'monthly' ? 'เดือนนี้' : 'รอบเวลา'})
                </h3>
              </div>
              <div className="text-3xl font-bold font-headline tracking-tight text-brand-on-surface mb-1">
                ฿{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.')[0]}
                <span className="text-sm font-normal text-brand-on-surface-variant">.{totalExpense.toFixed(2).split('.')[1]}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-brand-primary mt-2.5">
                <TrendingDown className="w-3.5 h-3.5 text-brand-primary" />
                <span>ลดลง 12% เทียบกับเดือนที่แล้ว</span>
              </div>
            </div>
          </div>

          {/* Main Categories breakdown progress bars */}
          <div className="glass-panel rounded-2xl p-6 border border-brand-primary/10">
            <h3 className="text-sm font-semibold text-brand-on-surface mb-5">หมวดหมู่หลัก</h3>
            
            <div className="space-y-5">
              {categoryDetails.map((c) => (
                <div 
                  key={c.name}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHighlightedCategory(c.name)}
                  onMouseLeave={() => setHighlightedCategory(null)}
                  onClick={() => {
                    setFilterCategory(c.name);
                    setActiveTab('transactions');
                  }}
                >
                  <div className="flex justify-between text-xs font-semibold mb-1.5 transition-colors group-hover:text-brand-primary">
                    <span className="text-brand-on-surface">{c.name}</span>
                    <span className="text-brand-on-surface-variant">฿{c.amount.toLocaleString()} ({c.percentage}%)</span>
                  </div>
                  
                  <div className="w-full bg-brand-surface rounded-full h-1.5 overflow-hidden border border-brand-primary/10">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${c.percentage}%`,
                        backgroundColor: c.color,
                        opacity: highlightedCategory && highlightedCategory !== c.name ? 0.4 : 1
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Donut Chart Visualizer Area */}
        <div className="lg:col-span-8 glass-elevated rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8 border border-brand-primary/10 relative overflow-hidden">
          
          {/* Decorative subtle top glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Donut Chart visual - SVG circular ring style */}
          <div className="relative w-48 h-48 md:w-60 md:h-60 flex-shrink-0 z-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Shadow base ring */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke="rgba(125, 211, 252, 0.05)"
                strokeWidth="12"
              />
              
              {/* Dynamic segments with dasharrays */}
              {donutSegments.map((seg) => {
                const r = 50;
                const circ = 2 * Math.PI * r; // ~314.159
                const dashOffset = circ - (seg.percentage / 100) * circ;
                const rotationDegrees = (seg.startPercent / 100) * 360;
                const isFocused = highlightedCategory === seg.name;

                return (
                  <circle
                    key={seg.name}
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isFocused ? "15" : "12"}
                    strokeDasharray={circ}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-300 cursor-pointer"
                    style={{
                      transform: `rotate(${rotationDegrees}deg)`,
                      transformOrigin: 'center',
                      opacity: highlightedCategory && highlightedCategory !== seg.name ? 0.35 : 1
                    }}
                    onMouseEnter={() => setHighlightedCategory(seg.name)}
                    onMouseLeave={() => setHighlightedCategory(null)}
                    onClick={() => {
                      setFilterCategory(seg.name);
                      setActiveTab('transactions');
                    }}
                  />
                );
              })}
            </svg>

            {/* Donut inner center ring */}
            <div className="absolute w-[68%] h-[68%] bg-brand-surface rounded-full flex flex-col items-center justify-center border border-brand-primary/25 shadow-[0_2px_10px_rgba(0,0,0,0.2)] z-20 select-none">
              <span className="text-[10px] md:text-xs text-brand-on-surface-variant font-medium">
                {highlightedCategory ? highlightedCategory : 'รวมทั้งหมด'}
              </span>
              <span className="text-lg md:text-2xl font-bold text-brand-primary tracking-tight mt-0.5">
                {highlightedCategory 
                  ? `฿${categoryDetails.find(c => c.name === highlightedCategory)?.amount.toLocaleString()}`
                  : `฿${totalExpense.toLocaleString()}`
                }
              </span>
            </div>
          </div>

          {/* Interactive Chart Legend */}
          <div className="flex-1 w-full z-10 space-y-4">
            <h3 className="text-base font-semibold text-brand-on-surface pb-2 border-b border-brand-primary/10">สัดส่วนค่าใช้จ่าย</h3>
            
            <ul className="space-y-2.5">
              {categoryDetails.map((c) => {
                const isFocused = highlightedCategory === c.name;
                return (
                  <li 
                    key={c.name}
                    onMouseEnter={() => setHighlightedCategory(c.name)}
                    onMouseLeave={() => setHighlightedCategory(null)}
                    onClick={() => {
                      setFilterCategory(c.name);
                      setActiveTab('transactions');
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      isFocused ? 'bg-brand-surface-variant/40' : 'hover:bg-brand-surface-variant/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full transition-shadow duration-300"
                        style={{ 
                          backgroundColor: c.color,
                          boxShadow: isFocused ? `0 0 10px ${c.color}` : 'none'
                        }}
                      />
                      <span className="text-sm text-brand-on-surface font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-brand-on-surface-variant font-medium">{c.percentage}%</span>
                      <span 
                        className="text-sm font-semibold text-right w-20"
                        style={{ color: isFocused ? c.color : 'inherit' }}
                      >
                        ฿{c.amount.toLocaleString()}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>

    </motion.div>
  );
};
export default ReportsTab;
