"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { day: "1", income: 0, expenses: 200 },
  { day: "5", income: 3000, expenses: 500 },
  { day: "10", income: 3200, expenses: 1200 },
  { day: "15", income: 3200, expenses: 2000 },
  { day: "20", income: 5200, expenses: 2500 },
  { day: "25", income: 5200, expenses: 3000 },
  { day: "30", income: 7200, expenses: 3500 },
]

export function CashFlowChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip formatter={(value) => [`R$ ${value}`, ""]} />
        <Legend />
        <Line type="monotone" dataKey="income" name="Receitas" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="expenses" name="Despesas" stroke="#ef4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
