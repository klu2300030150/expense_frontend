import { useState, useEffect } from 'react';
import { expenseApi, budgetApi, analyticsApi, Expense, Budget } from '@/lib/api';

// Custom hook for expenses
export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseApi.getAll();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await expenseApi.create(expense);
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
      throw err;
    }
  };

  const updateExpense = async (id: number, expense: Partial<Expense>) => {
    try {
      const updatedExpense = await expenseApi.update(id, expense);
      setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
      return updatedExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
      throw err;
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await expenseApi.delete(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
      throw err;
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}

// Custom hook for budgets
export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetApi.getAll();
      setBudgets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      const newBudget = await budgetApi.create(budget);
      setBudgets(prev => [...prev, newBudget]);
      return newBudget;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add budget');
      throw err;
    }
  };

  const updateBudget = async (id: number, budget: Partial<Budget>) => {
    try {
      const updatedBudget = await budgetApi.update(id, budget);
      setBudgets(prev => prev.map(b => b.id === id ? updatedBudget : b));
      return updatedBudget;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget');
      throw err;
    }
  };

  const deleteBudget = async (id: number) => {
    try {
      await budgetApi.delete(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete budget');
      throw err;
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };
}

// Custom hook for analytics
export function useAnalytics() {
  const [spendingByCategory, setSpendingByCategory] = useState<any>(null);
  const [monthlyTrends, setMonthlyTrends] = useState<any>(null);
  const [budgetComparison, setBudgetComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpendingByCategory = async (period?: string) => {
    try {
      setLoading(true);
      const data = await analyticsApi.getSpendingByCategory(period);
      setSpendingByCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch spending data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyTrends = async () => {
    try {
      setLoading(true);
      const data = await analyticsApi.getMonthlyTrends();
      setMonthlyTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch monthly trends');
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetComparison = async () => {
    try {
      setLoading(true);
      const data = await analyticsApi.getBudgetComparison();
      setBudgetComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budget comparison');
    } finally {
      setLoading(false);
    }
  };

  return {
    spendingByCategory,
    monthlyTrends,
    budgetComparison,
    loading,
    error,
    fetchSpendingByCategory,
    fetchMonthlyTrends,
    fetchBudgetComparison,
  };
}