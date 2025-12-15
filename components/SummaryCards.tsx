import React from 'react';
import { FinancialSummary } from '../types';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardsProps {
  summary: FinancialSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Balance Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Saldo</p>
            <h3 className={`text-2xl font-bold mt-1 ${summary.balance < 0 ? 'text-danger' : 'text-gray-900'}`}>
              {formatCurrency(summary.balance)}
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-full text-primary">
            <Wallet size={24} />
          </div>
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-secondary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Pemasukan</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">
              {formatCurrency(summary.totalIncome)}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full text-secondary">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-danger">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Pengeluaran</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">
              {formatCurrency(summary.totalExpense)}
            </h3>
          </div>
          <div className="p-3 bg-rose-50 rounded-full text-danger">
            <TrendingDown size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};