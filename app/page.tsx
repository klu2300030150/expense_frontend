"use client"

import { useState, useEffect } from "react"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { Dashboard } from "@/components/dashboard"
import { BudgetTracker } from "@/components/budget-tracker"
import { InsightsPanel } from "@/components/insights-panel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, ChartBarIcon, CreditCardIcon, LightBulbIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline"

export interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  type: "expense" | "income"
  recurring?: boolean
  tags?: string[]
}

export interface Budget {
  category: string
  limit: number
  spent: number
  period: "monthly" | "weekly"
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showForm, setShowForm] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses")
    const savedBudgets = localStorage.getItem("budgets")
    const savedDarkMode = localStorage.getItem("darkMode")

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
    setShowForm(false)
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const updateBudget = (budget: Budget) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === budget.category)
      if (existing) {
        return prev.map((b) => (b.category === budget.category ? budget : b))
      }
      return [...prev, budget]
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">ExpenseFlow</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              </Button>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <PlusIcon className="w-4 h-4" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="dashboard" className="gap-2">
              <ChartBarIcon className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <LightBulbIcon className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard expenses={expenses} budgets={budgets} />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <ExpenseList expenses={expenses} onDelete={deleteExpense} onAddExpense={() => setShowForm(true)} />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <BudgetTracker budgets={budgets} expenses={expenses} onUpdateBudget={updateBudget} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <InsightsPanel expenses={expenses} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <ExpenseForm onSubmit={addExpense} onCancel={() => setShowForm(false)} />
          </Card>
        </div>
      )}
    </div>
  )
}
