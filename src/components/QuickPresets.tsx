import React from 'react';
import { Sparkles, Utensils, Car, Tv, ShoppingBag, Briefcase, PlusCircle, Landmark } from 'lucide-react';
import { PresetTemplate, getPresets } from '../utils/presets';

interface QuickPresetsProps {
  onSelectPreset: (preset: PresetTemplate) => void;
}

const getPresetIcon = (preset: PresetTemplate) => {
  const desc = preset.description.toLowerCase();
  const cat = preset.category;
  if (cat === 'อาหารและเครื่องดื่ม' || desc.includes('ข้าว') || desc.includes('แกง') || desc.includes('กาแฟ') || desc.includes('อาหาร')) {
    return <Utensils className="w-4.5 h-4.5 text-brand-primary" />;
  }
  if (cat === 'การเดินทาง' || desc.includes('รถไฟฟ้า') || desc.includes('บีทีเอส') || desc.includes('bts') || desc.includes('มอเตอร์ไซค์') || desc.includes('รถ')) {
    return <Car className="w-4.5 h-4.5 text-amber-500" />;
  }
  if (cat === 'ความบันเทิง' || desc.includes('สตรีมมิ่ง') || desc.includes('หนัง')) {
    return <Tv className="w-4.5 h-4.5 text-purple-500" />;
  }
  if (cat === 'ช้อปปิ้ง' || desc.includes('บ้าน') || desc.includes('ของใช้')) {
    return <ShoppingBag className="w-4.5 h-4.5 text-emerald-500" />;
  }
  if (preset.type === 'income' || desc.includes('เงินเดือน')) {
    return <Landmark className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />;
  }
  return <Briefcase className="w-4.5 h-4.5 text-brand-primary" />;
};

export const QuickPresets: React.FC<QuickPresetsProps> = ({ onSelectPreset }) => {
  const presets = getPresets();

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 border border-brand-primary/10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-brand-primary animate-pulse" />
        <div>
          <h3 className="text-sm font-semibold text-brand-on-surface">เทมเพลตด่วน (Quick Presets)</h3>
          <p className="text-[11px] text-brand-on-surface-variant">บันทึกรายการประจำได้ง่ายขึ้นในคลิกเดียว</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {presets.map((preset) => {
          const isIncome = preset.type === 'income';
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="group relative flex flex-col justify-between text-left p-3.5 rounded-xl border border-brand-primary/10 bg-brand-surface/40 hover:bg-brand-surface-variant/25 hover:border-brand-primary/35 transition-all duration-200 cursor-pointer overflow-hidden glow-effect-hover"
            >
              {/* Top Row: Icon & type badge */}
              <div className="flex items-center justify-between gap-2 mb-2 w-full">
                <div className="p-1.5 rounded-lg bg-brand-surface border border-brand-primary/5 group-hover:scale-105 transition-transform">
                  {getPresetIcon(preset)}
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  isIncome 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-brand-primary/10 text-brand-primary'
                }`}>
                  {isIncome ? 'รายรับ' : 'รายจ่าย'}
                </span>
              </div>

              {/* Info: Description and amount */}
              <div>
                <h4 className="text-xs font-semibold text-brand-on-surface truncate group-hover:text-brand-primary transition-colors">
                  {preset.description}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-brand-on-surface-variant truncate max-w-[60%]">
                    {preset.category}
                  </span>
                  <span className={`text-xs font-bold ${
                    isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-error'
                  }`}>
                    {isIncome ? '+' : '-'}฿{preset.amount}
                  </span>
                </div>
              </div>

              {/* Plus indicator on hover */}
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <PlusCircle className="w-3.5 h-3.5 text-brand-primary" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
