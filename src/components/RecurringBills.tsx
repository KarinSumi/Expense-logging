import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Power,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  Subscription, 
  getUpcomingBills, 
  calculateTotalRecurringCost,
  filterSubscriptions 
} from '../utils/recurring';
import { paginateList } from '../utils/pagination';

interface RecurringBillsProps {
  subscriptions: Subscription[];
  onLogBill: (subscription: Subscription) => void;
  onToggleActive: (id: string) => void;
  onOpenSettings: () => void;
}

export const RecurringBills: React.FC<RecurringBillsProps> = ({
  subscriptions,
  onLogBill,
  onToggleActive,
  onOpenSettings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Compact grid layout with 4 items per page

  // Calculate stats based on base subscriptions
  const totalCost = calculateTotalRecurringCost(subscriptions);

  // Extract unique categories for filter
  const uniqueCategories = useMemo(() => {
    const categories = subscriptions.map(sub => sub.category);
    return Array.from(new Set(categories));
  }, [subscriptions]);

  // Reset page when filter/query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  // Map subscriptions to get daysRemaining and format dates
  const mappedUpcoming = useMemo(() => {
    return getUpcomingBills(subscriptions);
  }, [subscriptions]);

  // Filter the subscriptions
  const filteredUpcoming = useMemo(() => {
    // We want to preserve the days remaining logic if active, otherwise keep placeholder daysRemaining
    const mappedWithAll = subscriptions.map(sub => {
      if (sub.active) {
        const found = mappedUpcoming.find(u => u.id === sub.id);
        return found || { ...sub, daysRemaining: 30, formattedDueDate: `ทุกวันที่ ${sub.dueDate} ของเดือน` };
      }
      return {
        ...sub,
        daysRemaining: 999, // placeholder for inactive
        formattedDueDate: `ทุกวันที่ ${sub.dueDate} ของเดือน (ปิดการทำงาน)`
      };
    });

    return filterSubscriptions(mappedWithAll, searchQuery, categoryFilter, statusFilter);
  }, [subscriptions, mappedUpcoming, searchQuery, categoryFilter, statusFilter]);

  // Paginated list
  const paginatedResult = useMemo(() => {
    return paginateList(filteredUpcoming, currentPage, pageSize);
  }, [filteredUpcoming, currentPage]);

  const displayedItems = paginatedResult.items;

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 border border-brand-primary/10 flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-brand-primary/5">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-primary" />
          <div>
            <h3 className="text-sm font-semibold text-brand-on-surface">บริการสมาชิกและบิลประจำ</h3>
            <p className="text-[11px] text-brand-on-surface-variant">ควบคุมการเงินรายเดือนจากบริการสตรีมมิ่งและค่าใช้จ่ายประจำ</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[10px] text-brand-on-surface-variant font-medium block">จ่ายรวมต่อเดือน</span>
          <span className="text-sm font-extrabold text-brand-primary">฿{totalCost.toLocaleString()}</span>
        </div>
      </div>

      {/* Search and Filters inside Subscriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="relative sm:col-span-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-on-surface-variant" />
          <input
            type="text"
            placeholder="ค้นหาบิล/บริการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl py-2 pl-9 pr-8 text-xs text-brand-on-surface placeholder:text-brand-on-surface-variant focus:outline-none focus:border-brand-primary"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-on-surface-variant hover:text-brand-on-surface"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category select */}
        <div className="sm:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl px-3 py-2 text-[11px] font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
          >
            <option value="all">หมวดหมู่ทั้งหมด</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status select */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl px-3 py-2 text-[11px] font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="active">เปิดใช้งาน</option>
            <option value="inactive">ปิดชั่วคราว</option>
          </select>
        </div>
      </div>

      {/* Main Grid List */}
      {displayedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-brand-primary/10 rounded-xl bg-brand-surface/20">
          <CreditCard className="w-8 h-8 text-brand-on-surface-variant mb-2 opacity-50" />
          <p className="text-xs text-brand-on-surface font-semibold">ไม่พบบริการที่ตรงกับเงื่อนไข</p>
          <p className="text-[10px] text-brand-on-surface-variant mt-1 max-w-[240px]">
            ลองเปลี่ยนคำค้นหาหรือตัวกรอง หรือเพิ่มบริการใหม่ในปุ่มด้านล่าง
          </p>
          <button
            onClick={onOpenSettings}
            className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-3 py-1.5 rounded-lg border border-brand-primary/20 hover:bg-brand-primary/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            เพิ่มหรือแก้ไขบริการ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayedItems.map((sub) => {
            const isDueSoon = sub.active && sub.daysRemaining <= 3;
            const isDueToday = sub.active && sub.daysRemaining === 0;

            return (
              <div
                key={sub.id}
                className={`relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group bg-brand-surface/40 hover:bg-brand-surface-variant/15 ${
                  !sub.active
                    ? 'border-brand-primary/5 opacity-60 bg-brand-surface-container/10'
                    : isDueToday
                    ? 'border-brand-error/35 bg-brand-error/5'
                    : isDueSoon
                    ? 'border-amber-500/35 bg-amber-500/5'
                    : 'border-brand-primary/10'
                }`}
              >
                {/* Left content: Information */}
                <div className="space-y-1.5 max-w-[65%]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${sub.active ? 'bg-emerald-500' : 'bg-brand-on-surface-variant'}`} />
                    <h4 className="text-xs font-bold text-brand-on-surface truncate">
                      {sub.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-brand-on-surface-variant font-medium">
                    <span>{sub.category}</span>
                    <span>•</span>
                    <span className="truncate">{sub.formattedDueDate}</span>
                  </div>

                  {/* Days remaining badge / Active status */}
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-on-surface-variant" />
                    <span className={`text-[10px] font-bold ${
                      !sub.active
                        ? 'text-brand-on-surface-variant'
                        : isDueToday 
                        ? 'text-brand-error animate-pulse' 
                        : isDueSoon 
                        ? 'text-amber-500' 
                        : 'text-brand-on-surface-variant'
                    }`}>
                      {!sub.active
                        ? 'ปิดใช้งานอยู่'
                        : isDueToday 
                        ? 'ถึงกำหนดชำระวันนี้แล้ว!' 
                        : `เหลือเวลาอีก ${sub.daysRemaining} วัน`
                      }
                    </span>
                  </div>
                </div>

                {/* Right content: cost & quick pay action */}
                <div className="flex flex-col items-end gap-2.5">
                  <span className="text-xs font-black text-brand-on-surface">
                    ฿{sub.amount.toLocaleString()}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => onToggleActive(sub.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        sub.active 
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                          : 'border-brand-primary/10 bg-brand-surface text-brand-on-surface-variant hover:bg-brand-primary/5'
                      }`}
                      title={sub.active ? 'ปิดการทำงานชั่วคราว' : 'เปิดใช้งานบิลประจำ'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={() => onLogBill(sub)}
                      disabled={!sub.active}
                      className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-brand-primary text-[10px] font-black text-brand-background hover:bg-brand-primary/90 disabled:opacity-30 disabled:hover:bg-brand-primary disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm shadow-brand-primary/15"
                      title="บันทึกชำระค่าบริการเข้ารายการหลัก"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      จ่ายบิล
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls for Subscriptions List */}
      {filteredUpcoming.length > pageSize && (
        <div className="flex items-center justify-between pt-3 border-t border-brand-primary/5 text-[10px] font-bold text-brand-on-surface-variant">
          <span>
            แสดง {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredUpcoming.length)} จากทั้งหมด {filteredUpcoming.length} บิล
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-brand-primary/10 bg-brand-surface hover:bg-brand-primary/5 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2">{currentPage} / {paginatedResult.totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(paginatedResult.totalPages, prev + 1))}
              disabled={currentPage === paginatedResult.totalPages}
              className="p-1 rounded-lg border border-brand-primary/10 bg-brand-surface hover:bg-brand-primary/5 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default RecurringBills;
