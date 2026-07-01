import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { Subscription } from '../utils/recurring';
import { generateCalendarGrid, CalendarDay } from '../utils/calendar';

interface BillsCalendarProps {
  subscriptions: Subscription[];
  onLogBill: (sub: Subscription) => void;
}

export const BillsCalendar: React.FC<BillsCalendarProps> = ({
  subscriptions,
  onLogBill
}) => {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const monthNamesThai = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const daysOfWeekThai = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const grid = generateCalendarGrid(currentYear, currentMonth, subscriptions);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDay(null);
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.bills.length > 0) {
      setSelectedDay(day);
    } else {
      setSelectedDay(null);
    }
  };

  // Find all bills due in the current displayed month to list them
  const currentMonthBills = subscriptions.filter(sub => sub.active);

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 border border-brand-primary/10 space-y-5">
      
      {/* Calendar Header with navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-primary" />
          <div>
            <h3 className="text-sm font-semibold text-brand-on-surface">ปฏิทินบิลชำระรายเดือน</h3>
            <p className="text-[11px] text-brand-on-surface-variant">แสดงกำหนดเวลาครบกำหนดบิลในแต่ละสัปดาห์</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-brand-surface/40 px-3.5 py-1.5 rounded-xl border border-brand-primary/10 self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-all text-brand-on-surface-variant cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-black text-brand-on-surface w-[120px] text-center">
            {monthNamesThai[currentMonth]} {currentYear + 543}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-all text-brand-on-surface-variant cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* Days of week labels */}
        {daysOfWeekThai.map((day, index) => (
          <div
            key={index}
            className={`text-center text-[11px] font-extrabold pb-2 ${
              index === 0 ? 'text-brand-error' : index === 6 ? 'text-brand-primary' : 'text-brand-on-surface-variant'
            }`}
          >
            {day}
          </div>
        ))}

        {/* 42 calendar cells */}
        {grid.map((cell, index) => {
          const hasBills = cell.bills.length > 0;
          const isToday =
            cell.date.getDate() === now.getDate() &&
            cell.date.getMonth() === now.getMonth() &&
            cell.date.getFullYear() === now.getFullYear();

          const isSelected = selectedDay && 
            cell.dayNumber === selectedDay.dayNumber && 
            cell.isCurrentMonth === selectedDay.isCurrentMonth;

          return (
            <button
              key={index}
              onClick={() => handleDayClick(cell)}
              className={`min-h-[50px] md:min-h-[70px] p-1 rounded-xl border text-left flex flex-col justify-between transition-all relative cursor-pointer ${
                cell.isCurrentMonth
                  ? 'bg-brand-surface/20 text-brand-on-surface hover:bg-brand-primary/5'
                  : 'bg-transparent text-brand-on-surface-variant/30 border-transparent pointer-events-none'
              } ${
                isToday
                  ? 'border-brand-primary bg-brand-primary/5 shadow-[0_0_12px_rgba(125,211,252,0.15)]'
                  : 'border-brand-primary/5'
              } ${
                isSelected ? 'border-brand-primary bg-brand-primary/10 ring-1 ring-brand-primary' : ''
              }`}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] md:text-xs font-black px-1.5 py-0.5 rounded-md ${
                  isToday 
                    ? 'bg-brand-primary text-brand-background' 
                    : cell.isCurrentMonth 
                    ? 'text-brand-on-surface' 
                    : 'text-brand-on-surface-variant/30'
                }`}>
                  {cell.dayNumber}
                </span>

                {/* Subtitle Dot for mobile or counts */}
                {hasBills && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] md:hidden mr-1" />
                )}
              </div>

              {/* Bills list preview for desktop screens */}
              <div className="hidden md:block w-full space-y-0.5 mt-1 overflow-hidden">
                {cell.bills.slice(0, 2).map((bill) => (
                  <div
                    key={bill.id}
                    className="text-[9px] font-extrabold truncate px-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
                    title={bill.name}
                  >
                    ฿{bill.amount}
                  </div>
                ))}
                {cell.bills.length > 2 && (
                  <div className="text-[8px] font-bold text-brand-primary pl-1">
                    +{cell.bills.length - 2} รายการ
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Bills or General summary list */}
      <div className="mt-4 pt-4 border-t border-brand-primary/10">
        {selectedDay ? (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-primary" />
              กำหนดชำระวันที่ {selectedDay.dayNumber} {monthNamesThai[currentMonth]}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedDay.bills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-brand-primary/10 bg-brand-surface/40 hover:bg-brand-surface-variant/15 transition-all duration-200"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-brand-on-surface">{bill.name}</p>
                    <p className="text-[10px] text-brand-on-surface-variant">{bill.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-on-surface">฿{bill.amount.toLocaleString()}</span>
                    <button
                      onClick={() => onLogBill(bill)}
                      className="p-1.5 rounded-lg bg-brand-primary text-brand-background hover:bg-brand-primary/90 transition-all cursor-pointer"
                      title="บันทึกชำระค่าบริการ"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-brand-on-surface flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-brand-primary animate-pulse" />
              สรุปรายการบิลสมาชิกที่เปิดใช้งาน ({currentMonthBills.length} บริการ)
            </h4>
            
            {currentMonthBills.length === 0 ? (
              <p className="text-[11px] text-brand-on-surface-variant italic">ไม่มีบิลชำระประจำรายเดือนเปิดใช้งานอยู่ขณะนี้</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentMonthBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-brand-surface/30 border border-brand-primary/10 text-[10px] font-bold text-brand-on-surface hover:border-brand-primary/30 transition-all"
                  >
                    <span>{bill.name}</span>
                    <span className="text-brand-primary">฿{bill.amount.toLocaleString()}</span>
                    <span className="text-brand-on-surface-variant/40">|</span>
                    <span className="text-emerald-500 font-semibold">วันที่ {bill.dueDate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
