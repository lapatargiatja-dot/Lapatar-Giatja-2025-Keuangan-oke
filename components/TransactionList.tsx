import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, CATEGORIES } from '../types';
import { Trash2, ArrowUpCircle, ArrowDownCircle, Filter, X, Calendar } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  limit?: number;
  showFilters?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onDelete, 
  limit,
  showFilters = false 
}) => {
  // Filter States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState<TransactionType | 'ALL'>('ALL');

  // Combine all categories for the filter dropdown
  const allCategories = useMemo(() => {
    const uniqueCategories = new Set([...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE]);
    return Array.from(uniqueCategories).sort();
  }, []);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const txDate = t.date.split('T')[0];
      
      const matchStart = startDate ? txDate >= startDate : true;
      const matchEnd = endDate ? txDate <= endDate : true;
      const matchCategory = selectedCategory ? t.category === selectedCategory : true;
      const matchType = selectedType !== 'ALL' ? t.type === selectedType : true;

      return matchStart && matchEnd && matchCategory && matchType;
    });
  }, [transactions, startDate, endDate, selectedCategory, selectedType]);

  // Sort by date descending
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayTransactions = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategory('');
    setSelectedType('ALL');
  };

  const hasActiveFilters = startDate || endDate || selectedCategory || selectedType !== 'ALL';

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-gray-800 font-medium">Belum Ada Transaksi</h3>
        <p className="text-gray-500 text-sm mt-1">Mulai catat keuanganmu hari ini!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Toolbar - Only shown when enabled */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Date Range */}
            <div className="flex flex-1 gap-2">
              <div className="w-full">
                <label className="text-xs text-gray-500 mb-1 block">Dari Tanggal</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  />
                  <Calendar className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                </div>
              </div>
              <div className="w-full">
                <label className="text-xs text-gray-500 mb-1 block">Sampai Tanggal</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  />
                  <Calendar className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                </div>
              </div>
            </div>

            {/* Type & Category */}
            <div className="flex flex-1 gap-2">
               <div className="w-1/3">
                <label className="text-xs text-gray-500 mb-1 block">Tipe</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as TransactionType | 'ALL')}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
                >
                  <option value="ALL">Semua</option>
                  <option value={TransactionType.INCOME}>Pemasukan</option>
                  <option value={TransactionType.EXPENSE}>Pengeluaran</option>
                </select>
              </div>
              <div className="w-2/3">
                <label className="text-xs text-gray-500 mb-1 block">Kategori</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
                >
                  <option value="">Semua Kategori</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-danger bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 h-[38px]"
                >
                  <X size={16} />
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State after filter */}
      {displayTransactions.length === 0 && hasActiveFilters ? (
         <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <Filter className="text-gray-400" size={20} />
          </div>
          <p className="text-gray-500 font-medium">Tidak ada transaksi yang sesuai filter.</p>
          <button onClick={resetFilters} className="text-primary text-sm mt-2 hover:underline">
            Hapus Filter
          </button>
        </div>
      ) : (
        /* Table */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 font-medium">
                          {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        {t.description && <span className="text-xs text-gray-400">{t.description}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {t.type === TransactionType.INCOME ? (
                          <ArrowUpCircle className="text-secondary mr-2" size={16} />
                        ) : (
                          <ArrowDownCircle className="text-danger mr-2" size={16} />
                        )}
                        <span className={`text-sm font-semibold ${
                          t.type === TransactionType.INCOME ? 'text-secondary' : 'text-danger'
                        }`}>
                          {t.type === TransactionType.INCOME ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => onDelete(t.id)}
                        className="text-gray-400 hover:text-danger transition-colors p-2 rounded-full hover:bg-rose-50"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};