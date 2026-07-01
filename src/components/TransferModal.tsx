import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRightLeft, Info } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleTransfer: (e: React.FormEvent) => void;
  transferAmount: string;
  setTransferAmount: (amount: string) => void;
  transferTo: string;
  setTransferTo: (to: string) => void;
  currentBalance: number;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  handleTransfer,
  transferAmount,
  setTransferAmount,
  transferTo,
  setTransferTo,
  currentBalance
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-sm glass-panel border border-brand-primary/20 shadow-2xl rounded-2xl p-6 md:p-8 z-10 bg-brand-background/95"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-headline text-brand-primary flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 animate-pulse" />
                <span>โอนเงินออก</span>
              </h3>
              <button
                onClick={onClose}
                className="text-brand-on-surface-variant hover:text-brand-on-surface p-1 rounded-lg hover:bg-brand-surface-variant/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
              
              {/* Info badge */}
              <div className="bg-brand-primary/10 border border-brand-primary/20 p-3 rounded-xl text-xs text-brand-primary flex items-start gap-2">
                <Info className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <span>ยอดเงินคงเหลือของคุณที่สามารถโอนได้คือ: <strong className="font-bold">฿{currentBalance.toLocaleString()}</strong></span>
              </div>

              {/* Amount to transfer */}
              <div>
                <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1.5 uppercase tracking-wide">จำนวนเงินโอน</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary font-bold text-lg">฿</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl py-3 pl-10 pr-4 text-brand-on-surface font-semibold focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-lg placeholder:text-brand-on-surface-variant"
                  />
                </div>
              </div>

              {/* Transfer destination */}
              <div>
                <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1.5 uppercase tracking-wide">โอนไปยัง</label>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full bg-brand-surface text-sm border border-brand-primary/20 rounded-xl py-2.5 px-3.5 text-brand-on-surface focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary [&>option]:bg-brand-background"
                >
                  <option value="บัญชีออมทรัพย์เสริม">บัญชีออมทรัพย์เสริม (กสิกรไทย)</option>
                  <option value="บัญชีลงทุนเปิดพอร์ต">บัญชีพอร์ตการลงทุน (กองทุนรวม)</option>
                  <option value="ครอบครัว / มารดา">คุณแม่ (บัญชีออมทรัพย์)</option>
                  <option value="สลากออมสินพิเศษ">สลากออมสินพิเศษ 2 ปี</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-brand-surface border border-brand-primary/10 text-brand-on-surface py-2.5 rounded-xl text-xs font-semibold hover:bg-brand-surface-variant/25 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-primary text-brand-background py-2.5 rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-all cursor-pointer"
                >
                  ยืนยันโอนเงิน
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default TransferModal;
