"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon, LightBulbIcon } from "@heroicons/react/24/outline"
import type { Expense } from "@/app/page"

interface InsightsPanelProps {
  expenses: Expense[]
}

export function InsightsPanel({ expenses }: InsightsPanelProps) {
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

  // Calculate insights
  const currentMonth = new Date().getMonth()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const currentYear = new Date().getFullYear()
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const currentMonthExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear && expense.type === "expense"
  })

  const lastMonthExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date)
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && expense.type === "expense"
  })

  const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const lastTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyChange = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0

  // Category analysis
  const categoryTotals = currentMonthExpenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]

  // Spending patterns
  const weekdaySpending = currentMonthExpenses.reduce(
    (acc, expense) => {
      const day = new Date(expense.date).getDay()
      acc[day] = (acc[day] || 0) + expense.amount
      return acc
    },
    {} as Record<number, number>,
  )

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const highestSpendingDay = Object.entries(weekdaySpending).sort(([, a], [, b]) => b - a)[0]

  // Average transaction
  const avgTransaction = currentMonthExpenses.length > 0 ? currentTotal / currentMonthExpenses.length : 0

  // Recurring expenses
  const recurringExpenses = expenses.filter((expense) => expense.recurring && expense.type === "expense")
  const recurringTotal = recurringExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Generate insights
  const insights = []

  if (monthlyChange !== 0) {
    insights.push({
      type: monthlyChange > 0 ? "warning" : "positive",
      icon: monthlyChange > 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      title: `Spending ${monthlyChange > 0 ? "increased" : "decreased"} by ${Math.abs(monthlyChange).toFixed(1)}%`,
      description: `Compared to last month, you've ${monthlyChange > 0 ? "spent more" : "saved"} $${Math.abs(currentTotal - lastTotal).toFixed(2)}`,
      action:
        monthlyChange > 10 ? "Consider reviewing your budget" : monthlyChange < -10 ? "Great job saving money!" : "",
    })
  }

  if (topCategory) {
    const [category, amount] = topCategory
    const percentage = (amount / currentTotal) * 100
    insights.push({
      type: percentage > 40 ? "warning" : "info",
      icon: LightBulbIcon,
      title: `${categoryEmojis[category]} ${category.charAt(0).toUpperCase() + category.slice(1)} is your top expense`,
      description: `$${amount.toFixed(2)} (${percentage.toFixed(1)}% of total spending)`,
      action: percentage > 40 ? "This category dominates your spending" : "",
    })
  }

  if (highestSpendingDay) {
    const [dayIndex, amount] = highestSpendingDay
    insights.push({
      type: "info",
      icon: CalendarIcon,
      title: `You spend most on ${weekdays[Number.parseInt(dayIndex)]}s`,
      description: `Average of $${amount.toFixed(2)} on this day`,
      action: "Plan ahead for high-spending days",
    })
  }

  if (avgTransaction > 0) {
    insights.push({
      type: avgTransaction > 50 ? "warning" : "info",
      icon: ArrowTrendingUpIcon,
      title: `Average transaction: $${avgTransaction.toFixed(2)}`,
      description: `Based on ${currentMonthExpenses.length} transactions this month`,
      action: avgTransaction > 100 ? "Consider if large purchases are necessary" : "",
    })
  }

  if (recurringExpenses.length > 0) {
    insights.push({
      type: "info",
      icon: LightBulbIcon,
      title: `$${recurringTotal.toFixed(2)} in recurring expenses`,
      description: `${recurringExpenses.length} recurring transactions tracked`,
      action: "Review subscriptions and recurring payments regularly",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Smart Insights</h2>
        <p className="text-muted-foreground">AI-powered analysis of your spending patterns</p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <Card
              key={index}
              className={`${
                insight.type === "warning"
                  ? "border-warning bg-warning/5"
                  : insight.type === "positive"
                    ? "border-primary bg-primary/5"
                    : "border-border"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      insight.type === "warning"
                        ? "bg-warning/20 text-warning"
                        : insight.type === "positive"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-balance">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    {insight.action && (
                      <Badge variant="outline" className="text-xs">
                        💡 {insight.action}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-lg font-semibold mb-2">Not enough data for insights</h3>
              <p className="text-muted-foreground">
                Add more transactions to get personalized spending insights and recommendations
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{expenses.length}</div>
            <div className="text-sm text-muted-foreground">Total Transactions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{Object.keys(categoryTotals).length}</div>
            <div className="text-sm text-muted-foreground">Categories Used</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{recurringExpenses.length}</div>
            <div className="text-sm text-muted-foreground">Recurring Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {currentMonthExpenses.length > 0 ? Math.ceil(currentMonthExpenses.length / new Date().getDate()) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Daily Avg Transactions</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
