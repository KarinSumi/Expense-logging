import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Sun, Moon, Download, Upload, Database, Trash2, Plus, CalendarRange } from 'lucide-react';
import { Theme } from '../utils/theme';
import { Subscription } from '../utils/recurring';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSaveBudget: (e: React.FormEvent) => void;
  tempBudget: string;
  setTempBudget: (budget: string) => void;
  tempSavingsTarget: string;
  setTempSavingsTarget: (target: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImportJSON: (file: File) => void;
  onResetData: () => void;
  subscriptions: Subscription[];
  onAddSubscription: (name: string, amount: number, category: string, dueDate: number) => void;
  onDeleteSubscription: (id: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  handleSaveBudget,
  tempBudget,
  setTempBudget,
  tempSavingsTarget,
  setTempSavingsTarget,
  theme,
  setTheme,
  onExportJSON,
  onExportCSV,
  onImportJSON,
  onResetData,
  subscriptions,
  onAddSubscription,
  onDeleteSubscription
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for new subscription entry
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('อาหารและเครื่องดื่ม');
  const [newSubDueDate, setNewSubDueDate] = useState('1');

  const handleAddNewSubscription = (e: React.MouseEvent) => {
    e.preventDefault();
    const amt = parseFloat(newSubAmount);
    const day = parseInt(newSubDueDate);

    if (!newSubName.trim()) {
      alert('กรุณากรอกชื่อบริการ/บิล');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      alert('กรุณากรอกยอดชำระที่ถูกต้อง');
      return;
    }
    if (isNaN(day) || day < 1 || day > 31) {
      alert('กรุณากรอกวันครบกำหนดที่ถูกต้อง (วันที่ 1 ถึง 31)');
      return;
    }

    onAddSubscription(newSubName, amt, newSubCategory, day);
    
    // Reset local states
    setNewSubName('');
    setNewSubAmount('');
    setNewSubDueDate('1');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      // Reset input value so it can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
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
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin glass-panel border border-brand-primary/20 shadow-2xl rounded-2xl p-6 md:p-8 z-10 bg-brand-background/95"
          >

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-headline text-brand-primary flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <span>ตั้งค่าแอปพลิเคชัน</span>
              </h3>
              <button
                onClick={onClose}
                className="text-brand-on-surface-variant hover:text-brand-on-surface p-1 rounded-lg hover:bg-brand-surface-variant/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <p className="text-xs text-brand-on-surface-variant leading-relaxed">
                ปรับแต่งข้อมูลส่วนตัว งบประมาณรายจ่ายรายเดือน และสไตล์หน้าจอสำหรับการใช้งาน
              </p>

              <div>
                <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1.5 uppercase tracking-wide">วงเงินรายเดือน (บาท)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary font-bold text-lg">฿</span>
                  <input
                    type="number"
                    placeholder="35,000"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl py-3 pl-10 pr-4 text-brand-on-surface font-semibold focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-lg placeholder:text-brand-on-surface-variant"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1.5 uppercase tracking-wide">เป้าหมายเงินออมประจำเดือน (บาท)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-lg">฿</span>
                  <input
                    type="number"
                    placeholder="10,000"
                    value={tempSavingsTarget}
                    onChange={(e) => setTempSavingsTarget(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-primary/20 rounded-xl py-3 pl-10 pr-4 text-brand-on-surface font-semibold focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-lg placeholder:text-brand-on-surface-variant"
                  />
                </div>
              </div>

              {/* Theme Selector Section */}
              <div className="border-t border-brand-primary/10 pt-4">
                <label className="block text-xs font-semibold text-brand-on-surface-variant mb-2.5 uppercase tracking-wide">โหมดหน้าจอ (Theme)</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-brand-surface rounded-xl border border-brand-primary/10">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-brand-primary text-brand-background shadow-sm font-bold'
                        : 'text-brand-on-surface-variant hover:text-brand-on-surface'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>กลางวัน (Day)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-brand-primary text-brand-background shadow-sm font-bold'
                        : 'text-brand-on-surface-variant hover:text-brand-on-surface'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>กลางคืน (Night)</span>
                  </button>
                </div>
              </div>

              {/* Subscription Management Section */}
              <div className="border-t border-brand-primary/10 pt-4 space-y-3">
                <label className="block text-xs font-semibold text-brand-on-surface-variant uppercase tracking-wide flex items-center gap-1.5">
                  <CalendarRange className="w-4 h-4 text-brand-primary" />
                  จัดการบริการบิลประจำและสมาชิก
                </label>

                {/* Subscriptions List */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin pr-1">
                  {subscriptions.length === 0 ? (
                    <p className="text-[11px] text-brand-on-surface-variant text-center py-2 italic">
                      ยังไม่มีบริการสมาชิกที่บันทึกไว้
                    </p>
                  ) : (
                    subscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-brand-surface border border-brand-primary/10 text-xs"
                      >
                        <div className="truncate max-w-[60%]">
                          <p className="font-bold text-brand-on-surface truncate">{sub.name}</p>
                          <p className="text-[10px] text-brand-on-surface-variant">
                            ฿{sub.amount.toLocaleString()} • ทุกวันที่ {sub.dueDate}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteSubscription(sub.id)}
                          className="p-1.5 rounded-lg text-brand-error hover:bg-brand-error/10 transition-colors cursor-pointer"
                          title="ลบรายการบริการประจำนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Subscriptions Quick Form */}
                <div className="p-3.5 rounded-xl bg-brand-surface/50 border border-brand-primary/10 space-y-2.5">
                  <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">
                    + เพิ่มบริการสมาชิกใหม่
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="เช่น Netflix, ค่าน้ำ"
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-primary/20 rounded-lg p-2 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
                    />
                    <input
                      type="number"
                      placeholder="ยอดชำระ (บาท)"
                      value={newSubAmount}
                      onChange={(e) => setNewSubAmount(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-primary/20 rounded-lg p-2 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newSubCategory}
                      onChange={(e) => setNewSubCategory(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-primary/20 rounded-lg p-2 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
                    >
                      <option value="อาหารและเครื่องดื่ม">อาหารและเครื่องดื่ม</option>
                      <option value="ช้อปปิ้ง">ช้อปปิ้ง</option>
                      <option value="การเดินทาง">การเดินทาง</option>
                      <option value="ความบันเทิง">ความบันเทิง</option>
                      <option value="บิลและค่าสาธารณูปโภค">บิลและสาธารณูปโภค</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                    <input
                      type="number"
                      placeholder="จ่ายทุกวันที่ (1-31)"
                      min="1"
                      max="31"
                      value={newSubDueDate}
                      onChange={(e) => setNewSubDueDate(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-primary/20 rounded-lg p-2 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewSubscription}
                    className="w-full py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    เพิ่มบริการประจำนี้
                  </button>
                </div>
              </div>

              {/* Data Management Section */}
              <div className="border-t border-brand-primary/10 pt-4 space-y-3">
                <label className="block text-xs font-semibold text-brand-on-surface-variant uppercase tracking-wide">การจัดการข้อมูล (Data Management)</label>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onExportJSON}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-brand-primary/15 bg-brand-surface text-[11px] font-bold text-brand-on-surface hover:bg-brand-primary/5 transition-all cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-brand-primary" />
                    สำรองข้อมูล (JSON)
                  </button>
                  <button
                    type="button"
                    onClick={onExportCSV}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-brand-primary/15 bg-brand-surface text-[11px] font-bold text-brand-on-surface hover:bg-brand-primary/5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                    ส่งออกตาราง (CSV)
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-brand-primary/15 bg-brand-surface text-[11px] font-bold text-brand-on-surface hover:bg-brand-primary/5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-brand-primary" />
                    นำเข้าไฟล์สำรอง (.json)
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={onResetData}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-brand-error/20 bg-brand-error/5 text-[11px] font-bold text-brand-error hover:bg-brand-error/10 transition-all cursor-pointer"
                    title="ล้างข้อมูลและเริ่มใหม่"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    ล้างข้อมูลทั้งหมด
                  </button>
                </div>
              </div>

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
                  บันทึกข้อมูล
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default SettingsModal;
