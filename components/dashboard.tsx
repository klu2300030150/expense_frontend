"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, WalletIcon, CreditCardIcon } from "@heroicons/react/24/outline"
import type { Expense, Budget } from "@/app/page"

interface DashboardProps {
  expenses: Expense[]
  budgets: Budget[]
}

export function Dashboard({ expenses, budgets }: DashboardProps) {
  // Calculate totals
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear && expense.type === "expense"
    )
  })

  const monthlyIncome = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear && expense.type === "income"
    )
  })

  const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalIncome = monthlyIncome.reduce((sum, expense) => sum + expense.amount, 0)
  const balance = totalIncome - totalExpenses

  // Category breakdown
  const categoryTotals = monthlyExpenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Recent transactions
  const recentTransactions = expenses.slice(0, 5)

  const categoryEmojis: Record<string, string> = {
    food: "🍕",
    transport: "🚗",
    shopping: "🛍️",
    entertainment: "🎬",
    bills: "💡",
    health: "🏥",
    education: "📚",
    travel: "✈️",
    income: "💰",
    other: "📦",
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-primary" : "text-destructive"}`}>
              ${balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <ArrowTrendingUpIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{monthlyIncome.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <ArrowTrendingDownIcon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{monthlyExpenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg/Day</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalExpenses / new Date().getDate()).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Daily spending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCategories.length > 0 ? (
              topCategories.map(([category, amount]) => {
                const percentage = (amount / totalExpenses) * 100
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{categoryEmojis[category] || "📦"}</span>
                        <span className="font-medium capitalize">{category}</span>
                      </div>
                      <span className="font-semibold">${amount.toFixed(2)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">No expenses this month yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{categoryEmojis[transaction.category] || "📦"}</span>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${transaction.type === "income" ? "text-primary" : "text-destructive"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No transactions yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
