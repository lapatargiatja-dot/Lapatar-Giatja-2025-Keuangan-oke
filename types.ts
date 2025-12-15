export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string; // ISO String
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: 'ADD' | 'DELETE';
  details: string;
  amount: number;
}

export type ViewState = 'DASHBOARD' | 'TRANSACTIONS' | 'ANALYSIS' | 'LOGS';

export const CATEGORIES = {
  INCOME: [
    'Menjahit',
    'Doorsmeer',
    'Pangkas',
    'Greenhouse',
    'Kantor',
    'Las',
    'Bakery',
    'Laundry',
    'Tenun',
    'Pertanian LT',
    'Meubel',
    'Miniatur'
  ],
  EXPENSE: [
    'Menjahit',
    'Doorsmeer',
    'Pangkas',
    'Greenhouse',
    'Kantor',
    'Las',
    'Bakery',
    'Laundry',
    'Tenun',
    'Pertanian LT',
    'Meubel',
    'Miniatur'
  ]
};