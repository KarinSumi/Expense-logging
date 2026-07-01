import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddTransaction: (e: React.FormEvent) => void;
  txType: 'income' | 'expense';
  setTxType: (type: 'income' | 'expense') => void;
  txCategory: string;
  setTxCategory: (category: string) => void;
  txAmount: string;
  setTxAmount: (amount: string) => void;
  txDescription: string;
  setTxDescription: (desc: string) => void;
  txDate: string;
  setTxDate: (date: string) => void;
  txTime: string;
  setTxTime: (time: string) => void;
  categoriesByType: { expense: string[]; income: string[] };
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  handleAddTransaction,
  txType,
  setTxType,
  txCategory,
  setTxCategory,
  txAmount,
  setTxAmount,
  txDescription,
  setTxDescription,
  txDate,
  setTxDate,
  txTime,
  setTxTime,
  categoriesByType
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Modal backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal dialog card with gorgeous glass effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md glass-panel border border-brand-primary/20 shadow-2xl rounded-2xl p-6 md:p-8 z-10 bg-brand-background/95"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-headline text-brand-primary flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>บันทึกรายการใหม่</span>
              </h3>
              <button
                id="close-add-modal-btn"
                onClick={onClose}
                className="text-brand-on-surface-variant hover:text-brand-on-surface p-1 rounded-lg hover:bg-brand-surface-variant/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              
              {/* Transaction Type: Income vs Expense Toggle buttons */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-brand-surface rounded-xl border border-brand-primary/10">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    txType === 'expense'
                      ? 'bg-brand-error text-brand-background shadow-sm font-bold'
                      : 'text-brand-on-surface-variant hover:text-brand-on-surface'
                  }`}
                >
                  รายจ่าย (Expense)
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    txType === 'income'
                      ? 'bg-brand-primary text-brand-background shadow-sm font-bold'
                      : 'text-brand-on-surface-variant hover:text-brand-on-surface'
                  }`}
                >
                  รายรับ (Income)
                </button>
              </div>

              {/* Amount field */}
              <div>
                <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1.5 uppercase tracking-wide">จำนวนเงิน (บาท)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary font-bold text-lg">฿</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl py-3 pl-10 pr-4 text-brand-on-surface font-semibold focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-lg placeholder:text-brand-on-surface-variant"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1.5 uppercase tracking-wide">หมวดหมู่</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-brand-surface text-sm border border-brand-primary/20 rounded-xl py-2.5 px-3.5 text-brand-on-surface focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary [&>option]:bg-brand-background"
                >
                  {categoriesByType[txType].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description input */}
              <div>
                <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1.5 uppercase tracking-wide">รายละเอียด / คำอธิบาย</label>
                <input
                  type="text"
                  placeholder="เช่น ซุปเปอร์มาร์เก็ต, อาหารเที่ยง"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  required
                  className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl py-2.5 px-4 text-sm text-brand-on-surface focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-brand-on-surface-variant"
                />
              </div>

              {/* Date and Time inputs side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1.5 uppercase tracking-wide">วันที่</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl py-2.5 px-3 text-sm text-brand-on-surface focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1.5 uppercase tracking-wide">เวลา</label>
                  <input
                    type="time"
                    value={txTime}
                    onChange={(e) => setTxTime(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl py-2.5 px-3 text-sm text-brand-on-surface focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-brand-surface border border-brand-primary/10 text-brand-on-surface py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-surface-variant/25 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-primary text-brand-background py-2.5 rounded-xl text-sm font-bold hover:bg-brand-primary/90 transition-all cursor-pointer text-center"
                >
                  บันทึกรายการ
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default AddTransactionModal;
