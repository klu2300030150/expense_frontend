// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types for your expense tracker
export interface Expense {
  id?: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface Budget {
  id?: number;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Expense API methods
export const expenseApi = {
  // Get all expenses
  getAll: (): Promise<Expense[]> => 
    apiCall<Expense[]>('/expenses'),

  // Get expense by ID
  getById: (id: number): Promise<Expense> => 
    apiCall<Expense>(`/expenses/${id}`),

  // Create new expense
  create: (expense: Omit<Expense, 'id'>): Promise<Expense> =>
    apiCall<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    }),

  // Update expense
  update: (id: number, expense: Partial<Expense>): Promise<Expense> =>
    apiCall<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    }),

  // Delete expense
  delete: (id: number): Promise<void> =>
    apiCall<void>(`/expenses/${id}`, {
      method: 'DELETE',
    }),

  // Get expenses by category
  getByCategory: (category: string): Promise<Expense[]> =>
    apiCall<Expense[]>(`/expenses/category/${category}`),

  // Get expenses by date range
  getByDateRange: (startDate: string, endDate: string): Promise<Expense[]> =>
    apiCall<Expense[]>(`/expenses/date-range?start=${startDate}&end=${endDate}`),
};

// Budget API methods
export const budgetApi = {
  // Get all budgets
  getAll: (): Promise<Budget[]> => 
    apiCall<Budget[]>('/budgets'),

  // Create new budget
  create: (budget: Omit<Budget, 'id'>): Promise<Budget> =>
    apiCall<Budget>('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    }),

  // Update budget
  update: (id: number, budget: Partial<Budget>): Promise<Budget> =>
    apiCall<Budget>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budget),
    }),

  // Delete budget
  delete: (id: number): Promise<void> =>
    apiCall<void>(`/budgets/${id}`, {
      method: 'DELETE',
    }),
};

// Analytics API methods
export const analyticsApi = {
  // Get spending by category
  getSpendingByCategory: (period?: string): Promise<any> =>
    apiCall<any>(`/analytics/spending-by-category${period ? `?period=${period}` : ''}`),

  // Get monthly trends
  getMonthlyTrends: (): Promise<any> =>
    apiCall<any>('/analytics/monthly-trends'),

  // Get budget vs actual spending
  getBudgetComparison: (): Promise<any> =>
    apiCall<any>('/analytics/budget-comparison'),
};