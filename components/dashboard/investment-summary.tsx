"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const data = [
  { name: "Renda Fixa", value: 25000, growth: 5.2 },
  { name: "Ações", value: 12000, growth: 12.7 },
  { name: "Fundos", value: 8000, growth: 7.3 },
  { name: "Cripto", value: 4000, growth: -3.5 },
]

export function InvestmentSummary() {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {data.map((item) => (
          <Card key={item.name} className="dashboard-card">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">{item.name}</p>
                <p className="text-2xl font-bold">R$ {item.value.toLocaleString("pt-BR")}</p>
                <div className="flex items-center">
                  <Badge variant={item.growth >= 0 ? "success" : "destructive"} className="h-5">
                    {item.growth >= 0 ? "+" : ""}
                    {item.growth.toLocaleString("pt-BR")}%
                  </Badge>
                  <p className="ml-2 text-xs text-muted-foreground">
                    {((item.value / totalValue) * 100).toFixed(1)}% da carteira
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]} />
            <Legend />
            <Bar dataKey="value" name="Valor Atual" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
