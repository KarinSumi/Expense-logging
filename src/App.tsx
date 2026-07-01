/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart as PieChartIcon,
  Settings,
  LogOut,
  Plus,
  Bell,
  Search,
  X,
  CalendarRange
} from 'lucide-react';
import { Transaction, CategoryDetail } from './types';

// Import Utilities
import {
  getInitialTransactions,
  formatThaiDate,
  getWeekDates,
  mockupBaselines
} from './utils/helpers';
import { Theme, getInitialTheme } from './utils/theme';
import { PresetTemplate, createTransactionFromPreset } from './utils/presets';
import { exportTransactionsToJSON, exportTransactionsToCSV, validateImportedJSON } from './utils/backup';
import { Subscription, getInitialSubscriptions, createTransactionFromSubscription } from './utils/recurring';


// Import Modular Components
import DashboardTab from './components/DashboardTab';
import TransactionsTab from './components/TransactionsTab';
import ReportsTab from './components/ReportsTab';
import RecurringTab from './components/RecurringTab';
import AddTransactionModal from './components/AddTransactionModal';
import TransferModal from './components/TransferModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'reports' | 'recurring'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Transactions State (Loaded from localStorage if exists)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('glacier_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved transactions:', e);
      }
    }
    return getInitialTransactions();
  });

  // Settings / Profile State
  const [budgetLimit, setBudgetLimit] = useState<number>(() => {
    const saved = localStorage.getItem('glacier_budget_limit');
    return saved ? parseFloat(saved) : 35000;
  });
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempBudget, setTempBudget] = useState(budgetLimit.toString());

  const [savingsTarget, setSavingsTarget] = useState<number>(() => {
    const saved = localStorage.getItem('glacier_savings_target');
    return saved ? parseFloat(saved) : 10000;
  });
  const [tempSavingsTarget, setTempSavingsTarget] = useState(savingsTarget.toString());

  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('glacier_theme');
    return getInitialTheme(saved);
  });

  // Subscriptions & Recurring Bills State
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('glacier_subscriptions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading subscriptions:', e);
      }
    }
    return getInitialSubscriptions();
  });

  // Handler to toggle a subscription active/inactive
  const handleToggleActiveSubscription = (id: string) => {
    const updated = subscriptions.map(sub => 
      sub.id === id ? { ...sub, active: !sub.active } : sub
    );
    setSubscriptions(updated);
    localStorage.setItem('glacier_subscriptions', JSON.stringify(updated));
    const target = updated.find(sub => sub.id === id);
    if (target) {
      triggerToast(
        target.active 
          ? `เปิดใช้งานการแจ้งเตือนบิล "${target.name}" เรียบร้อยแล้ว`
          : `ปิดการทำงานของบิล "${target.name}" ชั่วคราว`
      );
    }
  };

  // Handler to log a recurring bill into primary transactions
  const handleLogBill = (sub: Subscription) => {
    const newTx = createTransactionFromSubscription(sub);
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem('glacier_transactions', JSON.stringify(updatedTxs));
    triggerToast(`จ่ายบิล "${sub.name}" สำเร็จ! และบันทึกเข้ารายการธุรกรรมแล้ว`);
  };

  // Handler to add a new subscription from Settings Modal
  const handleAddSubscription = (name: string, amount: number, category: string, dueDate: number) => {
    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      name,
      amount,
      category,
      billingCycle: 'monthly',
      dueDate,
      active: true
    };
    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    localStorage.setItem('glacier_subscriptions', JSON.stringify(updated));
    triggerToast(`เพิ่มบิลประจำ "${name}" จำนวน ฿${amount.toLocaleString()} สำเร็จ!`);
  };

  // Handler to delete a subscription from Settings Modal
  const handleDeleteSubscription = (id: string) => {
    const subToDelete = subscriptions.find(sub => sub.id === id);
    const updated = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updated);
    localStorage.setItem('glacier_subscriptions', JSON.stringify(updated));
    if (subToDelete) {
      triggerToast(`ลบบริการสมาชิก "${subToDelete.name}" เรียบร้อย`);
    }
  };

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('glacier_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Sync theme state to localStorage and documentElement class
  useEffect(() => {
    localStorage.setItem('glacier_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Transaction Form States
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txCategory, setTxCategory] = useState('อาหารและเครื่องดื่ม');
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [txTime, setTxTime] = useState(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
  });

  // Transfer Form States
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('บัญชีออมทรัพย์เสริม');

  // Available categories based on transaction type
  const categoriesByType = {
    expense: ['อาหารและเครื่องดื่ม', 'การเดินทาง', 'ช้อปปิ้ง', 'บิลและค่าใช้จ่าย', 'อื่นๆ'],
    income: ['เงินเดือน', 'การลงทุน', 'โบนัส', 'อื่นๆ']
  };

  // Keep category in sync with type changes
  useEffect(() => {
    setTxCategory(categoriesByType[txType][0]);
  }, [txType]);

  // Transaction Lists Filter States (for Transactions Tab)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('ทั้งหมด');

  // Reports view time filter
  const [reportTimeRange, setReportTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Base starting balance matching the mockup: base + income - expense = 124500
  const baseBalance = 104000;

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const currentBalance = useMemo(() => {
    return baseBalance + totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  // Dynamic Categories Breakdown for Expense
  const categoryDetails = useMemo<CategoryDetail[]>(() => {
    const totals: Record<string, number> = {
      'อาหารและเครื่องดื่ม': 0,
      'การเดินทาง': 0,
      'ช้อปปิ้ง': 0,
      'บิลและค่าใช้จ่าย': 0,
      'อื่นๆ': 0
    };

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const cat = totals[t.category] !== undefined ? t.category : 'อื่นๆ';
        totals[cat] += t.amount;
      });

    const sumExpenses = Object.values(totals).reduce((a, b) => a + b, 0);

    const colors: Record<string, string> = {
      'อาหารและเครื่องดื่ม': '#6366f1', 
      'การเดินทาง': '#3b82f6', 
      'ช้อปปิ้ง': '#a855f7', 
      'บิลและค่าใช้จ่าย': '#f43f5e', 
      'อื่นๆ': '#64748b' 
    };

    const icons: Record<string, string> = {
      'อาหารและเครื่องดื่ม': 'utensils',
      'การเดินทาง': 'car',
      'ช้อปปิ้ง': 'shopping_cart',
      'บิลและค่าใช้จ่าย': 'tv',
      'อื่นๆ': 'info'
    };

    return Object.keys(totals).map((name) => {
      const amount = totals[name];
      const percentage = sumExpenses > 0 ? Math.round((amount / sumExpenses) * 100) : 0;
      return {
        name,
        amount,
        percentage,
        color: colors[name],
        icon: icons[name]
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Donut chart segments generator
  const donutSegments = useMemo(() => {
    let cumulativePercent = 0;
    return categoryDetails
      .filter((c) => c.amount > 0)
      .map((c) => {
        const startPercent = cumulativePercent;
        cumulativePercent += c.percentage;
        return {
          ...c,
          startPercent,
          endPercent: cumulativePercent
        };
      });
  }, [categoryDetails]);

  // Selected Category Highlight state for Reports donut
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

  // Filtered Transactions for Transactions Tab
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'ทั้งหมด' || t.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    }).sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeB.getTime() - dateTimeA.getTime();
    });
  }, [transactions, searchQuery, filterType, filterCategory]);

  // Generate bar chart data (summing income & expense for Mon-Sun of the current week)
  const weeklyChartData = useMemo(() => {
    const dates = getWeekDates();
    const daysLabel = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];

    return daysLabel.map((day, idx) => {
      const dateStr = dates[idx];
      const dayTransactions = transactions.filter((t) => t.date === dateStr);
      const incSum = dayTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expSum = dayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      return {
        day,
        income: mockupBaselines[idx].income + incSum,
        expense: mockupBaselines[idx].expense + expSum
      };
    });
  }, [transactions]);

  // Max weekly value for chart height percentage scaling
  const maxChartValue = useMemo(() => {
    const values = weeklyChartData.flatMap(d => [d.income, d.expense]);
    return Math.max(...values, 1000);
  }, [weeklyChartData]);

  // Form Submit Handler
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(txAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }
    if (!txDescription.trim()) {
      alert('กรุณากรอกรายละเอียดรายการ');
      return;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: txType,
      category: txCategory,
      amount: parsedAmount,
      date: txDate,
      time: txTime,
      description: txDescription,
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsAddModalOpen(false);

    // Reset Form
    setTxAmount('');
    setTxDescription('');
    setTxDate(new Date().toISOString().split('T')[0]);
    triggerToast(`บันทึกรายการ "${txDescription}" สำเร็จแล้ว!`);
  };

  const handleSelectPreset = (preset: PresetTemplate) => {
    const newTx = createTransactionFromPreset(preset);
    setTransactions(prev => [newTx, ...prev]);
    triggerToast(`บันทึกรายการด่วน "${preset.description}" ฿${preset.amount.toLocaleString()} สำเร็จแล้ว!`);
  };

  // Transfer Handler
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }
    if (amount > currentBalance) {
      alert('ยอดเงินคงเหลือของคุณไม่เพียงพอสำหรับการโอนนี้');
      return;
    }

    // record transfer as an expense transaction for simplicity
    const newTx: Transaction = {
      id: `tx-transfer-${Date.now()}`,
      type: 'expense',
      category: 'อื่นๆ',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      time: (() => {
        const now = new Date();
        const hrs = now.getHours().toString().padStart(2, '0');
        const mns = now.getMinutes().toString().padStart(2, '0');
        return `${hrs}:${mns}`;
      })(),
      description: `โอนออกไปยัง ${transferTo}`,
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsTransferModalOpen(false);
    setTransferAmount('');
    triggerToast(`โอนเงินจำนวน ฿${amount.toLocaleString()} สำเร็จ!`);
  };

  // Delete Transaction Handler
  const handleDeleteTransaction = (id: string, description: string) => {
    if (confirm(`คุณต้องการลบรายการ "${description}" ใช่หรือไม่?`)) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      triggerToast(`ลบรายการ "${description}" เรียบร้อยแล้ว`);
    }
  };

  // Save Budget Configuration Handler
  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBudget = parseFloat(tempBudget);
    const parsedSavings = parseFloat(tempSavingsTarget);
    if (isNaN(parsedBudget) || parsedBudget <= 0 || isNaN(parsedSavings) || parsedSavings < 0) {
      alert('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }

    setBudgetLimit(parsedBudget);
    localStorage.setItem('glacier_budget_limit', parsedBudget.toString());

    setSavingsTarget(parsedSavings);
    localStorage.setItem('glacier_savings_target', parsedSavings.toString());

    setShowSettingsModal(false);
    triggerToast(`บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!`);
  };

  // Export JSON Backup Handler
  const handleExportJSON = () => {
    try {
      const dataStr = exportTransactionsToJSON(transactions);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `glacier_finance_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      triggerToast('สำรองข้อมูลเรียบร้อย! (ดาวน์โหลดเป็นไฟล์ JSON แล้ว)');
    } catch (err) {
      triggerToast('เกิดข้อผิดพลาดในการสำรองข้อมูล JSON');
    }
  };

  // Export CSV Spreadsheet Handler
  const handleExportCSV = () => {
    try {
      const csvStr = exportTransactionsToCSV(transactions);
      // UTF-8 BOM so Excel decodes Thai correctly
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `glacier_finance_transactions_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      triggerToast('ส่งออกตารางเรียบร้อย! (ดาวน์โหลดเป็นไฟล์ CSV แล้ว)');
    } catch (err) {
      triggerToast('เกิดข้อผิดพลาดในการส่งออกไฟล์ CSV');
    }
  };

  // Import Backup JSON Handler
  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const validated = validateImportedJSON(content);
        setTransactions(validated);
        // Persist imported transactions immediately
        localStorage.setItem('glacier_transactions', JSON.stringify(validated));
        triggerToast(`นำเข้าข้อมูลธุรกรรมสำเร็จแล้ว! (${validated.length} รายการ)`);
        setShowSettingsModal(false);
      } catch (err: any) {
        alert(err.message || 'รูปแบบไฟล์นำเข้าไม่ถูกต้อง');
      }
    };
    reader.readAsText(file);
  };

  // Reset all Data Handler
  const handleResetData = () => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะล้างข้อมูลทั้งหมด? การดำเนินการนี้ไม่สามารถย้อนกลับได้ และข้อมูลทั้งหมดจะถูกรีเซ็ตเป็นค่าเริ่มต้น')) {
      localStorage.clear();
      setTransactions(getInitialTransactions());
      setBudgetLimit(20000);
      setSavingsTarget(10000);
      setSubscriptions(getInitialSubscriptions());
      setTheme('dark');
      setTempBudget('20000');
      setTempSavingsTarget('10000');
      triggerToast('รีเซ็ตข้อมูลระบบกลับสู่ค่าเริ่มต้นเรียบร้อยแล้ว!');
      setShowSettingsModal(false);
    }
  };

  return (
    <div id="app-viewport" className="min-h-screen bg-brand-background font-sans text-brand-on-surface antialiased selection:bg-brand-primary selection:text-brand-background flex flex-col">
      
      {/* Dynamic Overlay Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-brand-surface/95 text-brand-on-surface text-xs md:text-sm font-semibold px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md border border-brand-primary/20"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar navigation (Web / Desktop) */}
      <aside id="desktop-sidebar" className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-brand-surface-container/60 backdrop-blur-2xl border-r border-brand-primary/10 py-8 z-40 select-none">
        {/* Profile Card */}
        <div className="px-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-primary/30 shadow-[0_0_15px_rgba(125,211,252,0.2)] transition-transform duration-300 hover:scale-105">
            <img 
              alt="โปรไฟล์ผู้ใช้" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3GanXRuXjLfUW-jpUe3FsbqWkiM0prQPg8D2_ha2cLsjei4FRZKBQgxOAhSNEs3TN-IWu3kY6q5yKQKCebVcMWJvh55ONtOeknSO5GROQ0IBXp-N8YZMlV5FnI7EYvc0-H1bOjx82AjFr4yLrm6G86j8t_toR5RqWwAioYtlxeGlYBtiNhWGxR8H_0PIrFWwEE20NIrjS1niypMN6VN7ecJedQ_T5sjDTerRKP2LcJqE6Os_U7HxIaQ" 
            />
          </div>
          <div>
            <h2 className="font-sans font-semibold text-brand-on-surface">สวัสดี คมสัน</h2>
            <p className="text-xs text-brand-on-surface-variant mt-0.5 bg-brand-primary/10 border border-brand-primary/20 px-1.5 py-0.5 rounded text-center inline-block">แผนพรีเมียม</p>
          </div>
        </div>

        <nav id="desktop-sidebar-nav" className="flex-1 space-y-1">
          <button
            id="tab-btn-dashboard"
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-brand-primary/15 text-brand-primary border-r-4 border-brand-primary'
                : 'text-brand-on-surface-variant hover:text-brand-on-surface hover:bg-brand-surface-variant/40'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>แดชบอร์ดหลัก</span>
          </button>

          <button
            id="tab-btn-transactions"
            onClick={() => { setActiveTab('transactions'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-brand-primary/15 text-brand-primary border-r-4 border-brand-primary'
                : 'text-brand-on-surface-variant hover:text-brand-on-surface hover:bg-brand-surface-variant/40'
            }`}
          >
            <ReceiptText className="w-5 h-5" />
            <span>รายการธุรกรรม</span>
          </button>

          <button
            id="tab-btn-reports"
            onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-brand-primary/15 text-brand-primary border-r-4 border-brand-primary'
                : 'text-brand-on-surface-variant hover:text-brand-on-surface hover:bg-brand-surface-variant/40'
            }`}
          >
            <PieChartIcon className="w-5 h-5" />
            <span>รายงานและสัดส่วน</span>
          </button>

          <button
            id="tab-btn-recurring"
            onClick={() => { setActiveTab('recurring'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === 'recurring'
                ? 'bg-brand-primary/15 text-brand-primary border-r-4 border-brand-primary'
                : 'text-brand-on-surface-variant hover:text-brand-on-surface hover:bg-brand-surface-variant/40'
            }`}
          >
            <CalendarRange className="w-5 h-5" />
            <span>บริการสมาชิก & วิเคราะห์</span>
          </button>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="px-6 mt-auto pt-6 border-t border-brand-primary/10 space-y-3">
          <button
            id="sidebar-add-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary py-3 rounded-xl hover:bg-brand-primary/20 transition-all duration-300 shadow-[0_0_15px_rgba(125,211,252,0.1)] font-medium text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มรายการใหม่</span>
          </button>

          <button
            id="sidebar-settings-btn"
            onClick={() => {
              setTempBudget(budgetLimit.toString());
              setTempSavingsTarget(savingsTarget.toString());
              setShowSettingsModal(true);
            }}
            className="w-full flex items-center gap-3 text-brand-on-surface-variant hover:text-brand-on-surface px-6 py-3.5 text-sm font-medium hover:bg-brand-surface-variant/40 transition-all duration-200 cursor-pointer rounded-lg"
          >
            <Settings className="w-5 h-5" />
            <span>ตั้งค่าวงเงิน</span>
          </button>

          <button
            id="sidebar-logout-btn"
            onClick={() => triggerToast('จำลองสถานะ: ออกจากระบบ')}
            className="w-full flex items-center gap-3 text-brand-on-surface-variant hover:text-brand-error px-6 py-3.5 text-sm font-medium hover:bg-brand-error/10 transition-all duration-200 cursor-pointer rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 md:ml-64 relative z-10 flex flex-col min-h-screen pb-24 md:pb-8">
        
        {/* Header TopBar */}
        <header className="flex justify-between items-center px-6 py-4 w-full bg-brand-surface/60 backdrop-blur-xl sticky top-0 z-30 border-b border-brand-primary/10">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Hamburger */}
            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-brand-on-surface-variant hover:text-brand-primary transition-colors p-1 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-brand-primary font-headline tracking-tight">การเงินส่วนตัว</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="btn-bell"
              onClick={() => triggerToast('ไม่มีการแจ้งเตือนใหม่')}
              className="text-brand-on-surface-variant hover:text-brand-primary hover:bg-brand-surface-variant/40 p-2 rounded-full transition-all active:scale-95 duration-200 cursor-pointer"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              id="btn-search"
              onClick={() => { setActiveTab('transactions'); triggerToast('ค้นหารายการธุรกรรมของคุณ'); }}
              className="text-brand-on-surface-variant hover:text-brand-primary hover:bg-brand-surface-variant/40 p-2 rounded-full transition-all active:scale-95 duration-200 cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile User Avatar */}
            <div className="md:hidden w-8 h-8 rounded-full overflow-hidden border border-brand-primary/30">
              <img 
                alt="รูปโปรไฟล์ผู้ใช้" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3GanXRuXjLfUW-jpUe3FsbqWkiM0prQPg8D2_ha2cLsjei4FRZKBQgxOAhSNEs3TN-IWu3kY6q5yKQKCebVcMWJvh55ONtOeknSO5GROQ0IBXp-N8YZMlV5FnI7EYvc0-H1bOjx82AjFr4yLrm6G86j8t_toR5RqWwAioYtlxeGlYBtiNhWGxR8H_0PIrFWwEE20NIrjS1niypMN6VN7ecJedQ_T5sjDTerRKP2LcJqE6Os_U7HxIaQ" 
              />
            </div>
          </div>
        </header>

        {/* Dynamic Screen Area with standard transitions */}
        <div className="p-4 md:p-8 lg:p-10 flex-1 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardTab
                currentBalance={currentBalance}
                totalExpense={totalExpense}
                budgetLimit={budgetLimit}
                totalIncome={totalIncome}
                transactions={transactions}
                weeklyChartData={weeklyChartData}
                maxChartValue={maxChartValue}
                setIsAddModalOpen={setIsAddModalOpen}
                setIsTransferModalOpen={setIsTransferModalOpen}
                setActiveTab={setActiveTab}
                setSearchQuery={setSearchQuery}
                formatThaiDate={formatThaiDate}
                onSelectPreset={handleSelectPreset}
                savingsTarget={savingsTarget}
              />
            )}

            {activeTab === 'recurring' && (
              <RecurringTab
                transactions={transactions}
                budgetLimit={budgetLimit}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                subscriptions={subscriptions}
                onLogBill={handleLogBill}
                onToggleActiveSubscription={handleToggleActiveSubscription}
                onOpenSettings={() => {
                  setTempBudget(budgetLimit.toString());
                  setTempSavingsTarget(savingsTarget.toString());
                  setShowSettingsModal(true);
                }}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsTab
                filteredTransactions={filteredTransactions}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                formatThaiDate={formatThaiDate}
                handleDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsTab
                reportTimeRange={reportTimeRange}
                setReportTimeRange={setReportTimeRange}
                totalExpense={totalExpense}
                categoryDetails={categoryDetails}
                donutSegments={donutSegments}
                highlightedCategory={highlightedCategory}
                setHighlightedCategory={setHighlightedCategory}
                setFilterCategory={setFilterCategory}
                setActiveTab={setActiveTab}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation Mobile Bottom Bar */}
      <nav id="mobile-nav-bar" className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe h-20 bg-brand-surface/80 backdrop-blur-2xl rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)] border-t border-brand-primary/10">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 w-16 transition-all cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-brand-on-surface-variant'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">หน้าหลัก</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 w-16 transition-all cursor-pointer ${
            activeTab === 'transactions' ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-brand-on-surface-variant'
          }`}
        >
          <ReceiptText className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">ประวัติ</span>
        </button>

        {/* Floating Add Center Button on mobile */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex flex-col items-center justify-center text-brand-on-surface-variant -mt-6 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <div className="bg-brand-primary text-brand-background p-3.5 rounded-full border border-brand-primary/50 shadow-[0_0_15px_rgba(125,211,252,0.4)]">
            <Plus className="w-6 h-6 text-brand-background font-bold" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('recurring')}
          className={`flex flex-col items-center justify-center rounded-xl px-2 py-1 w-14 transition-all cursor-pointer ${
            activeTab === 'recurring' ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-brand-on-surface-variant'
          }`}
        >
          <CalendarRange className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium truncate w-full text-center">บิลสมาชิก</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center justify-center rounded-xl px-2 py-1 w-14 transition-all cursor-pointer ${
            activeTab === 'reports' ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-brand-on-surface-variant'
          }`}
        >
          <PieChartIcon className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium truncate w-full text-center">รายงาน</span>
        </button>
      </nav>

      {/* Floating Side Drawer for Mobile menu navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs"
            />
            {/* Drawer pane */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-0 left-0 bottom-0 w-64 z-50 bg-brand-surface flex flex-col py-8 shadow-2xl border-r border-brand-primary/10 md:hidden select-none"
            >
              {/* User profile */}
              <div className="px-6 mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-primary/30">
                    <img 
                      alt="โปรไฟล์ผู้ใช้" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3GanXRuXjLfUW-jpUe3FsbqWkiM0prQPg8D2_ha2cLsjei4FRZKBQgxOAhSNEs3TN-IWu3kY6q5yKQKCebVcMWJvh55ONtOeknSO5GROQ0IBXp-N8YZMlV5FnI7EYvc0-H1bOjx82AjFr4yLrm6G86j8t_toR5RqWwAioYtlxeGlYBtiNhWGxR8H_0PIrFWwEE20NIrjS1niypMN6VN7ecJedQ_T5sjDTerRKP2LcJqE6Os_U7HxIaQ" 
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm text-brand-on-surface font-sans">คมสัน</h2>
                    <p className="text-[10px] text-brand-primary font-medium">แผนพรีเมียม</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-brand-on-surface-variant hover:text-brand-on-surface cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation list */}
              <nav className="flex-grow flex flex-col gap-1">
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'dashboard' ? 'bg-brand-primary/15 text-brand-primary border-r-4 border-brand-primary' : 'text-brand-on-surface-variant hover:text-brand-on-surface hover:bg-brand-surface-variant/40'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>แดชบอร์ด</span>
                </button>
                <button
                  onClick={() => { setActiveTab('transactions'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'transactions' ? 'bg-brand-primary/15 text-brand-primary border-r-4 border-brand-primary' : 'text-brand-on-surface-variant hover:text-brand-on-surface hover:bg-brand-surface-variant/40'
                  }`}
                >
                  <ReceiptText className="w-5 h-5" />
                  <span>รายการธุรกรรม</span>
                </button>
                <button
                  onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'reports' ? 'bg-brand-primary/15 text-brand-primary border-r-4 border-brand-primary' : 'text-brand-on-surface-variant hover:text-brand-on-surface hover:bg-brand-surface-variant/40'
                  }`}
                >
                  <PieChartIcon className="w-5 h-5" />
                  <span>รายงาน</span>
                </button>
                <button
                  onClick={() => { setActiveTab('recurring'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'recurring' ? 'bg-brand-primary/15 text-brand-primary border-r-4 border-brand-primary' : 'text-brand-on-surface-variant hover:text-brand-on-surface hover:bg-brand-surface-variant/40'
                  }`}
                >
                  <CalendarRange className="w-5 h-5" />
                  <span>บริการสมาชิก & วิเคราะห์</span>
                </button>
              </nav>

              {/* Extra tools */}
              <div className="mt-auto px-6 space-y-3">
                <button
                  onClick={() => {
                    setTempBudget(budgetLimit.toString());
                    setTempSavingsTarget(savingsTarget.toString());
                    setShowSettingsModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-brand-surface-variant text-brand-on-surface border border-brand-outline-variant py-2.5 rounded-lg text-xs font-semibold hover:bg-brand-surface transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>ตั้งค่าวงเงิน</span>
                </button>
                <button
                  onClick={() => { triggerToast('ออกจากระบบเรียบร้อย'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-brand-error/10 text-brand-error py-2.5 rounded-lg text-xs font-semibold hover:bg-brand-error/20 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals Container */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        handleAddTransaction={handleAddTransaction}
        txType={txType}
        setTxType={setTxType}
        txCategory={txCategory}
        setTxCategory={setTxCategory}
        txAmount={txAmount}
        setTxAmount={setTxAmount}
        txDescription={txDescription}
        setTxDescription={setTxDescription}
        txDate={txDate}
        setTxDate={setTxDate}
        txTime={txTime}
        setTxTime={setTxTime}
        categoriesByType={categoriesByType}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        handleTransfer={handleTransfer}
        transferAmount={transferAmount}
        setTransferAmount={setTransferAmount}
        transferTo={transferTo}
        setTransferTo={setTransferTo}
        currentBalance={currentBalance}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        handleSaveBudget={handleSaveBudget}
        tempBudget={tempBudget}
        setTempBudget={setTempBudget}
        tempSavingsTarget={tempSavingsTarget}
        setTempSavingsTarget={setTempSavingsTarget}
        theme={theme}
        setTheme={setTheme}
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
        onImportJSON={handleImportJSON}
        onResetData={handleResetData}
        subscriptions={subscriptions}
        onAddSubscription={handleAddSubscription}
        onDeleteSubscription={handleDeleteSubscription}
      />

    </div>
  );
}
