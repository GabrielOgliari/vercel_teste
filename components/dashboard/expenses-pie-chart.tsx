"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Alimentação", value: 1200 },
  { name: "Transporte", value: 800 },
  { name: "Moradia", value: 2500 },
  { name: "Lazer", value: 500 },
  { name: "Utilidades", value: 600 },
  { name: "Outros", value: 400 },
]

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export function ExpensesPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
