import { Transaction } from '../types';

// Seed initial transactions matching the mockup's mathematical breakdown
export const getInitialTransactions = (): Transaction[] => {
  const today = new Date();
  const getOffsetDateString = (daysOffset: number): string => {
    const d = new Date(today);
    d.setDate(today.getDate() - daysOffset);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'tx-1',
      type: 'expense',
      category: 'ช้อปปิ้ง',
      amount: 1250,
      date: getOffsetDateString(0), // Today
      time: '14:30',
      description: 'ซุปเปอร์มาร์เก็ต',
    },
    {
      id: 'tx-2',
      type: 'expense',
      category: 'อาหารและเครื่องดื่ม',
      amount: 850,
      date: getOffsetDateString(1), // Yesterday
      time: '19:00',
      description: 'ร้านอาหาร',
    },
    {
      id: 'tx-3',
      type: 'income',
      category: 'เงินเดือน',
      amount: 45000,
      date: getOffsetDateString(5),
      time: '08:00',
      description: 'เงินเดือนพฤศจิกายน',
    },
    {
      id: 'tx-4',
      type: 'expense',
      category: 'บิลและค่าใช้จ่าย',
      amount: 419,
      date: getOffsetDateString(6),
      time: '10:15',
      description: 'Netflix',
    },
    {
      id: 'tx-5',
      type: 'expense',
      category: 'บิลและค่าใช้จ่าย',
      amount: 5706,
      date: getOffsetDateString(7),
      time: '15:20',
      description: 'บิลค่าไฟและสาธารณูปโภค',
    },
    {
      id: 'tx-6',
      type: 'expense',
      category: 'การเดินทาง',
      amount: 4900,
      date: getOffsetDateString(9),
      time: '11:45',
      description: 'ค่าน้ำมันและบัตรรถไฟฟ้า',
    },
    {
      id: 'tx-7',
      type: 'expense',
      category: 'ช้อปปิ้ง',
      amount: 2425,
      date: getOffsetDateString(12),
      time: '16:10',
      description: 'ซื้อของใช้ออนไลน์',
    },
    {
      id: 'tx-8',
      type: 'expense',
      category: 'อาหารและเครื่องดื่ม',
      amount: 8950,
      date: getOffsetDateString(14),
      time: '20:30',
      description: 'บุฟเฟต์ปิ้งย่างครอบครัว',
    }
  ];
};

// Thai Date Formatter Helper
export const formatThaiDate = (dateStr: string): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const inputDate = new Date(dateStr);
  
  if (isNaN(inputDate.getTime())) return dateStr;

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateStr === todayStr) {
    return 'วันนี้';
  } else if (dateStr === yesterdayStr) {
    return 'เมื่อวาน';
  } else {
    const day = inputDate.getDate();
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const month = months[inputDate.getMonth()];
    return `${day} ${month}`;
  }
};

// Weekly date helper
export const getWeekDates = (): string[] => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const shift = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Align Mon to index 0, Sun to index 6
  const monday = new Date(today);
  monday.setDate(today.getDate() - shift);
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

// Standard baseline weights to guarantee a beautifully filled chart matching mockup styles
export const mockupBaselines = [
  { day: 'จ.', income: 6000, expense: 3000 },
  { day: 'อ.', income: 4000, expense: 5000 },
  { day: 'พ.', income: 8000, expense: 2000 },
  { day: 'พฤ.', income: 5500, expense: 4500 },
  { day: 'ศ.', income: 9000, expense: 3000 },
  { day: 'ส.', income: 2000, expense: 7000 },
  { day: 'อา.', income: 3000, expense: 2500 },
];
