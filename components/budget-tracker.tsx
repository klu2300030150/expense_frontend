"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import type { Expense, Budget } from "@/app/page"

interface BudgetTrackerProps {
  budgets: Budget[]
  expenses: Expense[]
  onUpdateBudget: (budget: Budget) => void
}

export function BudgetTracker({ budgets, expenses, onUpdateBudget }: BudgetTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    period: "monthly" as "monthly" | "weekly",
  })

  const categoryEmojis: Record<string, string> = {
    food: "🍕",
    transport: "🚗",
    shopping: "🛍️",
    entertainment: "🎬",
    bills: "💡",
    health: "🏥",
    education: "📚",
    travel: "✈️",
    other: "📦",
  }

  const categories = [
    "food",
    "transport",
    "shopping",
    "entertainment",
    "bills",
    "health",
    "education",
    "travel",
    "other",
  ]

  // Calculate spent amounts for each budget
  const budgetsWithSpent = budgets.map((budget) => {
    const now = new Date()
    const startDate =
      budget.period === "monthly"
        ? new Date(now.getFullYear(), now.getMonth(), 1)
        : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const spent = expenses
      .filter(
        (expense) =>
          expense.type === "expense" && expense.category === budget.category && new Date(expense.date) >= startDate,
      )
      .reduce((sum, expense) => sum + expense.amount, 0)

    return { ...budget, spent }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.limit) return

    onUpdateBudget({
      category: formData.category,
      limit: Number.parseFloat(formData.limit),
      spent: 0,
      period: formData.period,
    })

    setFormData({ category: "", limit: "", period: "monthly" })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Budget Tracker</h2>
          <p className="text-muted-foreground">Monitor your spending limits and stay on track</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <PlusIcon className="w-4 h-4" />
          Set Budget
        </Button>
      </div>

      {/* Budget Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Set New Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryEmojis[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limit">Budget Limit ($)</Label>
                  <Input
                    id="limit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.limit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, limit: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value: "monthly" | "weekly") => setFormData((prev) => ({ ...prev, period: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Set Budget</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetsWithSpent.length > 0 ? (
          budgetsWithSpent.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100
            const isOverBudget = percentage > 100
            const isNearLimit = percentage > 80 && percentage <= 100

            return (
              <Card
                key={budget.category}
                className={`${
                  isOverBudget
                    ? "border-destructive bg-destructive/5"
                    : isNearLimit
                      ? "border-warning bg-warning/5"
                      : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{categoryEmojis[budget.category]}</span>
                      <div>
                        <h3 className="font-semibold capitalize">{budget.category}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{budget.period} budget</p>
                      </div>
                    </div>
                    {isOverBudget && (
                      <Badge variant="destructive" className="gap-1">
                        <ExclamationTriangleIcon className="w-3 h-3" />
                        Over Budget
                      </Badge>
                    )}
                    {isNearLimit && !isOverBudget && (
                      <Badge variant="secondary" className="gap-1">
                        <ExclamationTriangleIcon className="w-3 h-3" />
                        Near Limit
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Spent: ${budget.spent.toFixed(2)}</span>
                      <span>Limit: ${budget.limit.toFixed(2)}</span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-3 ${
                        isOverBudget ? "[&>div]:bg-destructive" : isNearLimit ? "[&>div]:bg-warning" : ""
                      }`}
                    />
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-medium ${
                          isOverBudget ? "text-destructive" : isNearLimit ? "text-warning" : "text-muted-foreground"
                        }`}
                      >
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ${(budget.limit - budget.spent).toFixed(2)} remaining
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">No budgets set</h3>
              <p className="text-muted-foreground mb-4">Create budgets to track your spending and stay within limits</p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <PlusIcon className="w-4 h-4" />
                Set Your First Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
