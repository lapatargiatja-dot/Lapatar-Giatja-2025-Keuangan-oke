import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Transaction, TransactionType } from '../types';

interface FinancialChartsProps {
  transactions: Transaction[];
}

// Expanded color palette for more categories
const COLORS = [
  '#4f46e5', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#14b8a6', // Teal
  '#6366f1', // Indigo-lighter
  '#d946ef', // Fuchsia
  '#f43f5e'  // Rose
];

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ transactions }) => {
  
  // Helper to process data for pie charts
  const getCategoryData = (type: TransactionType) => {
    const filtered = transactions.filter(t => t.type === type);
    const categoryMap = new Map<string, number>();

    filtered.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  };

  const incomeData = useMemo(() => getCategoryData(TransactionType.INCOME), [transactions]);
  const expenseData = useMemo(() => getCategoryData(TransactionType.EXPENSE), [transactions]);

  // Prepare Data for Bar Chart (Last 7 Days)
  const last7DaysData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => t.date.startsWith(dateStr));
      const income = dayTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        Pemasukan: income,
        Pengeluaran: expense
      });
    }
    return data;
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 mb-8">
        Belum ada data untuk ditampilkan di grafik.
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Pie Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pemasukan per Unit Usaha</h3>
          <div className="h-64 w-full flex-1">
            {incomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#10b981"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>Belum ada data pemasukan</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengeluaran per Unit Usaha</h3>
          <div className="h-64 w-full flex-1">
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#ef4444"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>Belum ada data pengeluaran</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tren Mingguan</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={last7DaysData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Legend />
              <Bar dataKey="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};