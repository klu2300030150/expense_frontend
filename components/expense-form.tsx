"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XMarkIcon } from "@heroicons/react/24/outline"
import type { Expense } from "@/app/page"

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id">) => void
  onCancel: () => void
}

const categories = [
  { value: "food", label: "🍕 Food & Dining", color: "bg-orange-100 text-orange-800" },
  { value: "transport", label: "🚗 Transportation", color: "bg-blue-100 text-blue-800" },
  { value: "shopping", label: "🛍️ Shopping", color: "bg-purple-100 text-purple-800" },
  { value: "entertainment", label: "🎬 Entertainment", color: "bg-pink-100 text-pink-800" },
  { value: "bills", label: "💡 Bills & Utilities", color: "bg-yellow-100 text-yellow-800" },
  { value: "health", label: "🏥 Healthcare", color: "bg-red-100 text-red-800" },
  { value: "education", label: "📚 Education", color: "bg-indigo-100 text-indigo-800" },
  { value: "travel", label: "✈️ Travel", color: "bg-green-100 text-green-800" },
  { value: "income", label: "💰 Income", color: "bg-emerald-100 text-emerald-800" },
  { value: "other", label: "📦 Other", color: "bg-gray-100 text-gray-800" },
]

export function ExpenseForm({ onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense" as "expense" | "income",
    recurring: false,
    tags: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.description || !formData.category) return

    onSubmit({
      amount: Number.parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      type: formData.type,
      recurring: formData.recurring,
      tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
    })
  }

  // Quick amount buttons
  const quickAmounts = [5, 10, 25, 50, 100]

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Add New {formData.type === "expense" ? "Expense" : "Income"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <XMarkIcon className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="flex items-center justify-center gap-4 p-2 bg-muted rounded-lg">
            <Button
              type="button"
              variant={formData.type === "expense" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFormData((prev) => ({ ...prev, type: "expense" }))}
              className="flex-1"
            >
              💸 Expense
            </Button>
            <Button
              type="button"
              variant={formData.type === "income" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFormData((prev) => ({ ...prev, type: "income" }))}
              className="flex-1"
            >
              💰 Income
            </Button>
          </div>

          {/* Amount with Quick Buttons */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className="text-lg font-semibold"
            />
            <div className="flex gap-2 flex-wrap">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData((prev) => ({ ...prev, amount: amount.toString() }))}
                  className="text-xs"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              placeholder="work, lunch, urgent (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between">
            <Label htmlFor="recurring">Recurring {formData.type}</Label>
            <Switch
              id="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, recurring: checked }))}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            Add {formData.type === "expense" ? "Expense" : "Income"}
          </Button>
        </form>
      </CardContent>
    </>
  )
}
