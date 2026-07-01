import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  X, 
  Trash2, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown
} from 'lucide-react';
import { Transaction } from '../types';
import CategoryIcon from './CategoryIcon';
import { paginateList } from '../utils/pagination';

interface TransactionsTabProps {
  filteredTransactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'income' | 'expense';
  setFilterType: (type: 'all' | 'income' | 'expense') => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  formatThaiDate: (dateStr: string) => string;
  handleDeleteTransaction: (id: string, description: string) => void;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  filteredTransactions,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  formatThaiDate,
  handleDeleteTransaction
}) => {
  // State for pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Reset page to 1 when search or category filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterCategory]);

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      if (sortBy === 'date-asc') {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      }
      // Default to date-desc
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });
  }, [filteredTransactions, sortBy]);

  // Paginate transactions
  const paginatedResult = useMemo(() => {
    return paginateList(sortedTransactions, currentPage, pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const activePage = Math.min(paginatedResult.currentPage, paginatedResult.totalPages);
  const displayedItems = activePage !== currentPage ? paginateList(sortedTransactions, activePage, pageSize).items : paginatedResult.items;

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginatedResult.totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for smart pagination layout (e.g. 1, 2, 3...)
  const pageNumbers = useMemo(() => {
    const total = paginatedResult.totalPages;
    const current = activePage;
    const delta = 1; // Number of pages to show before and after current
    const pages: (number | string)[] = [];

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 || 
        i === total || 
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  }, [paginatedResult.totalPages, activePage]);

  // Calculation of indices
  const startItemIdx = filteredTransactions.length === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const endItemIdx = Math.min(activePage * pageSize, filteredTransactions.length);

  return (
    <motion.div
      key="transactions-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Filters & Sorting Panel */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col gap-4 border border-brand-primary/10">
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-on-surface-variant" />
            <input
              type="text"
              placeholder="ค้นหารายการ, หมวดหมู่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-on-surface placeholder:text-brand-on-surface-variant focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-on-surface-variant hover:text-brand-on-surface cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters selector */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Type Filters */}
            <div className="flex bg-brand-surface rounded-xl p-1 border border-brand-primary/20">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterType === 'all' 
                    ? 'bg-brand-primary text-brand-background font-semibold shadow-sm' 
                    : 'text-brand-on-surface-variant hover:text-brand-on-surface'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterType === 'income' 
                    ? 'bg-brand-primary text-brand-background font-semibold shadow-sm' 
                    : 'text-brand-on-surface-variant hover:text-brand-on-surface'
                }`}
              >
                รายรับ
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterType === 'expense' 
                    ? 'bg-brand-error text-brand-background font-semibold shadow-sm' 
                    : 'text-brand-on-surface-variant hover:text-brand-on-surface'
                }`}
              >
                รายจ่าย
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-brand-surface text-xs font-medium border border-brand-primary/20 rounded-xl px-3.5 py-2.5 text-brand-on-surface focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            >
              <option value="ทั้งหมด">หมวดหมู่ทั้งหมด</option>
              <option value="อาหารและเครื่องดื่ม">อาหารและเครื่องดื่ม</option>
              <option value="การเดินทาง">การเดินทาง</option>
              <option value="ช้อปปิ้ง">ช้อปปิ้ง</option>
              <option value="บิลและค่าใช้จ่าย">บิลและค่าใช้จ่าย</option>
              <option value="เงินเดือน">เงินเดือน</option>
              <option value="การลงทุน">การลงทุน</option>
              <option value="โบนัส">โบนัส</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-brand-surface border border-brand-primary/20 rounded-xl px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-primary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-brand-on-surface focus:outline-none cursor-pointer border-none p-0"
              >
                <option value="date-desc">ใหม่สุด ➔ เก่าสุด</option>
                <option value="date-asc">เก่าสุด ➔ ใหม่สุด</option>
                <option value="amount-desc">จำนวนเงิน: มาก ➔ น้อย</option>
                <option value="amount-asc">จำนวนเงิน: น้อย ➔ มาก</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterCategory('ทั้งหมด');
                setSortBy('date-desc');
                setCurrentPage(1);
              }}
              className="text-xs text-brand-primary hover:underline px-2 cursor-pointer font-medium"
            >
              รีเซ็ต
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table / List with Pagination */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-brand-primary/10 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-primary/10 bg-brand-surface-container/40 text-brand-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">รายการ</th>
                <th className="p-4">หมวดหมู่</th>
                <th className="p-4">วันที่ - เวลา</th>
                <th className="p-4 text-right">จำนวนเงิน</th>
                <th className="p-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/5 text-sm">
              {displayedItems.map((t) => (
                <tr key={t.id} className="hover:bg-brand-surface-variant/20 transition-colors group">
                  {/* Description with Icon */}
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-surface flex items-center justify-center border border-brand-primary/10">
                      <CategoryIcon iconName={t.category} className="w-5 h-5 text-brand-primary" />
                    </div>
                    <span className="font-semibold text-brand-on-surface">{t.description}</span>
                  </td>
                  {/* Category badge */}
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-brand-surface border border-brand-primary/20 text-brand-on-surface-variant">
                      {t.category}
                    </span>
                  </td>
                  {/* Date & Time */}
                  <td className="p-4 text-brand-on-surface-variant text-xs">
                    {formatThaiDate(t.date)} เวลา {t.time} น.
                  </td>
                  {/* Amount with color */}
                  <td className="p-4 text-right font-bold">
                    <span className={t.type === 'income' ? 'text-brand-primary' : 'text-brand-error'}>
                      {t.type === 'income' ? '+' : '-'} ฿{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  {/* Delete button */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteTransaction(t.id, t.description)}
                      className="text-brand-on-surface-variant hover:text-brand-error p-1.5 rounded-lg hover:bg-brand-error/10 transition-all cursor-pointer"
                      title="ลบรายการ"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-brand-on-surface-variant">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter className="w-8 h-8 text-brand-primary/10" />
                      <p className="text-sm font-medium">ไม่พบรายการที่ตรงกับตัวกรองของคุณ</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterType('all');
                          setFilterCategory('ทั้งหมด');
                        }}
                        className="text-xs text-brand-primary underline mt-1 cursor-pointer"
                      >
                        ล้างตัวกรองทั้งหมด
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls */}
        {filteredTransactions.length > 0 && (
          <div className="p-4 bg-brand-surface-container/20 border-t border-brand-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-brand-on-surface-variant">
            {/* Items count details */}
            <div>
              แสดง <span className="text-brand-primary font-bold">{startItemIdx}</span> ถึง <span className="text-brand-primary font-bold">{endItemIdx}</span> จากทั้งหมด <span className="text-brand-on-surface font-bold">{filteredTransactions.length}</span> รายการ
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-4">
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span>แสดงหน้าละ:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-brand-surface border border-brand-primary/20 rounded-lg px-2 py-1 text-xs text-brand-on-surface focus:outline-none cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-1">
                {/* First page button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={activePage === 1}
                  className="p-1.5 rounded-lg border border-brand-primary/10 bg-brand-surface text-brand-on-surface hover:bg-brand-primary/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="หน้าแรก"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Prev button */}
                <button
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  className="p-1.5 rounded-lg border border-brand-primary/10 bg-brand-surface text-brand-on-surface hover:bg-brand-primary/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="ก่อนหน้า"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {pageNumbers.map((num, idx) => {
                    if (num === '...') {
                      return (
                        <span key={`dots-${idx}`} className="px-2 text-brand-on-surface-variant select-none">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={`page-${num}`}
                        onClick={() => handlePageChange(num as number)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          activePage === num
                            ? 'bg-brand-primary text-brand-background shadow-sm'
                            : 'border border-brand-primary/10 bg-brand-surface text-brand-on-surface hover:bg-brand-primary/10'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === paginatedResult.totalPages}
                  className="p-1.5 rounded-lg border border-brand-primary/10 bg-brand-surface text-brand-on-surface hover:bg-brand-primary/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="ถัดไป"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last page button */}
                <button
                  onClick={() => handlePageChange(paginatedResult.totalPages)}
                  disabled={activePage === paginatedResult.totalPages}
                  className="p-1.5 rounded-lg border border-brand-primary/10 bg-brand-surface text-brand-on-surface hover:bg-brand-primary/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="หน้าสุดท้าย"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionsTab;
