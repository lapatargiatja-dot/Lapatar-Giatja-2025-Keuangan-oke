import React from 'react';
import { ActivityLog } from '../types';
import { History, PlusCircle, Trash2, Clock } from 'lucide-react';

interface ActivityLogListProps {
  logs: ActivityLog[];
}

export const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <History className="text-gray-400" size={32} />
        </div>
        <h3 className="text-gray-800 font-medium">Belum Ada Aktivitas</h3>
        <p className="text-gray-500 text-sm mt-1">Setiap perubahan data akan tercatat di sini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <History className="text-primary" size={20} />
                Riwayat Perubahan Data
            </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
              <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${
                log.action === 'ADD' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}>
                {log.action === 'ADD' ? <PlusCircle size={18} /> : <Trash2 size={18} />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900">
                    {log.action === 'ADD' ? 'Menambahkan Transaksi' : 'Menghapus Transaksi'}
                  </p>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(log.timestamp).toLocaleString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                <p className="text-xs font-mono text-gray-500 mt-1">
                  Nominal: Rp {log.amount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};