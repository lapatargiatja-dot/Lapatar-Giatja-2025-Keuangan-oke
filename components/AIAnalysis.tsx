import React, { useState } from 'react';
import { Transaction } from '../types';
import { analyzeFinances } from '../services/geminiService';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  transactions: Transaction[];
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeFinances(transactions);
    setAnalysis(result);
    setLoading(false);
    setHasAnalyzed(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-lg mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="text-yellow-300" />
              Analisis Keuangan Cerdas
            </h2>
            <p className="text-indigo-100 mb-6 max-w-2xl">
              Gunakan teknologi AI Gemini untuk menganalisis pola pengeluaran Anda dan dapatkan saran pribadi untuk mencapai tujuan finansial Anda lebih cepat.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={loading || transactions.length === 0}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sedang Menganalisis...
                </>
              ) : (
                <>
                  {hasAnalyzed ? <RefreshCw size={20} /> : <Sparkles size={20} />}
                  {hasAnalyzed ? 'Analisis Ulang' : 'Mulai Analisis'}
                </>
              )}
            </button>
          </div>
          <div className="hidden md:block opacity-20">
            <Sparkles size={120} />
          </div>
        </div>
      </div>

      {analysis && (
        <div className="bg-white rounded-xl shadow-sm p-8 animate-fade-in border border-indigo-100">
          <div className="prose prose-indigo max-w-none text-gray-700">
             <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
            Analisis ini dihasilkan oleh AI dan hanya bersifat saran. Selalu konsultasikan keputusan finansial penting dengan profesional.
          </div>
        </div>
      )}
    </div>
  );
};