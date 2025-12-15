import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, FinancialSummary, ViewState, ActivityLog } from './types';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { FinancialCharts } from './components/FinancialCharts';
import { AIAnalysis } from './components/AIAnalysis';
import { ActivityLogList } from './components/ActivityLogList';
import { LayoutDashboard, List, PieChart, Plus, Menu, X, Sparkles, History } from 'lucide-react';

const STORAGE_KEY = 'fintrack_data_v1';
const LOGS_KEY = 'fintrack_logs_v1';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default function App() {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load transactions", e);
      return [];
    }
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load logs", e);
      return [];
    }
  });
  
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }, [logs]);

  // Derived State: Summary
  const summary: FinancialSummary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);

  // Handlers
  const addLog = (action: 'ADD' | 'DELETE', details: string, amount: number) => {
    const newLog: ActivityLog = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      action,
      details,
      amount
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: generateId()
    };
    setTransactions(prev => [transaction, ...prev]);
    
    // Add Log
    const typeLabel = newTx.type === TransactionType.INCOME ? 'Pemasukan' : 'Pengeluaran';
    addLog('ADD', `Menambahkan ${typeLabel}: ${newTx.category} (${newTx.description || 'Tanpa catatan'})`, newTx.amount);
  };

  const deleteTransaction = (id: string) => {
    const txToDelete = transactions.find(t => t.id === id);
    if (txToDelete && confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Add Log
      const typeLabel = txToDelete.type === TransactionType.INCOME ? 'Pemasukan' : 'Pengeluaran';
      addLog('DELETE', `Menghapus ${typeLabel}: ${txToDelete.category}`, txToDelete.amount);
    }
  };

  // Navigation Item Component
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors ${
        currentView === view 
          ? 'bg-primary text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">G</div>
          Laporan Keuangan Giatja
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky md:top-0 h-full w-64 bg-white border-r z-40 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2 mb-8 hidden md:flex">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">G</div>
            Laporan Keuangan Giatja
          </h1>
          
          <nav className="space-y-2">
            <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="TRANSACTIONS" icon={List} label="Riwayat Transaksi" />
            <NavItem view="LOGS" icon={History} label="Aktivitas Sistem" />
            <NavItem view="ANALYSIS" icon={Sparkles} label="Analisis AI" />
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold">
              U
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">User Giatja</p>
              <p className="text-xs text-gray-500">Versi 1.1</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentView === 'DASHBOARD' && 'Dashboard Keuangan'}
              {currentView === 'TRANSACTIONS' && 'Riwayat Transaksi'}
              {currentView === 'LOGS' && 'Riwayat Aktivitas'}
              {currentView === 'ANALYSIS' && 'Analisis Cerdas'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors flex-1 sm:flex-none"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Tambah Data</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
        </header>

        {/* Views */}
        <div className="max-w-6xl mx-auto">
          {currentView === 'DASHBOARD' && (
            <>
              <SummaryCards summary={summary} />
              <FinancialCharts transactions={transactions} />
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Transaksi Terakhir</h3>
                <button 
                  onClick={() => setCurrentView('TRANSACTIONS')}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Lihat Semua
                </button>
              </div>
              <TransactionList transactions={transactions} onDelete={deleteTransaction} limit={5} />
            </>
          )}

          {currentView === 'TRANSACTIONS' && (
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction} 
              showFilters={true}
            />
          )}

          {currentView === 'LOGS' && (
             <ActivityLogList logs={logs} />
          )}

          {currentView === 'ANALYSIS' && (
            <AIAnalysis transactions={transactions} />
          )}
        </div>
      </main>

      {/* Modal Form */}
      {isFormOpen && (
        <TransactionForm onAdd={addTransaction} onClose={() => setIsFormOpen(false)} />
      )}

    </div>
  );
}