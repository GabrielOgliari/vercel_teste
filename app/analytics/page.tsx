"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { ArrowUpRight, Download, Filter, TrendingDown, TrendingUp, Calendar } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

// Dados de exemplo para os gráficos
const monthlyData = [
  { name: "Jan", receitas: 4000, despesas: 3400 },
  { name: "Fev", receitas: 3500, despesas: 3200 },
  { name: "Mar", receitas: 4200, despesas: 3800 },
  { name: "Abr", receitas: 5000, despesas: 4200 },
  { name: "Mai", receitas: 4800, despesas: 4100 },
  { name: "Jun", receitas: 5200, despesas: 4300 },
]

const categoryData = [
  { name: "Moradia", valor: 2500 },
  { name: "Alimentação", valor: 1200 },
  { name: "Transporte", valor: 800 },
  { name: "Lazer", valor: 600 },
  { name: "Saúde", valor: 500 },
  { name: "Outros", valor: 400 },
]

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

const investmentData = [
  { name: "Renda Fixa", valor: 25000, crescimento: 5.2 },
  { name: "Ações", valor: 12000, crescimento: 12.7 },
  { name: "Fundos", valor: 8000, crescimento: 7.3 },
  { name: "Cripto", valor: 4000, crescimento: -3.5 },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("6m")
  const [category, setCategory] = useState("all")
  const isMobile = useIsMobile()

  // Calcular totais
  const totalReceitas = monthlyData.reduce((sum, item) => sum + item.receitas, 0)
  const totalDespesas = monthlyData.reduce((sum, item) => sum + item.despesas, 0)
  const saldo = totalReceitas - totalDespesas
  const percentualEconomia = Math.round((saldo / totalReceitas) * 100)

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Análise Financeira</h1>
          <p className="text-muted-foreground">Acompanhe e analise seus dados financeiros</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Último mês</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar Relatório</span>
            <span className="inline sm:hidden">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">R$ {totalReceitas.toLocaleString("pt-BR")}</div>
                <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">R$ {totalDespesas.toLocaleString("pt-BR")}</div>
                <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
              </div>
              <Badge variant="outline" className="bg-destructive/10 text-destructive">
                <TrendingDown className="mr-1 h-3 w-3" />
                +8%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">R$ {saldo.toLocaleString("pt-BR")}</div>
                <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
              </div>
              <Badge variant={saldo > 0 ? "success" : "destructive"}>{saldo > 0 ? "Positivo" : "Negativo"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Economia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{percentualEconomia}%</div>
                <p className="text-xs text-muted-foreground">Receitas - Despesas</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10">
                <ArrowUpRight className={`h-5 w-5 ${percentualEconomia > 0 ? "text-success" : "text-destructive"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>Comparação mensal entre receitas e despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
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
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]} />
                  <Legend />
                  <Bar dataKey="receitas" name="Receitas" fill="hsl(var(--success))" />
                  <Bar dataKey="despesas" name="Despesas" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>Distribuição de despesas por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={!isMobile}
                    outerRadius={isMobile ? 60 : 80}
                    fill="#8884d8"
                    dataKey="valor"
                    label={!isMobile && (({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`)}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise de tendências */}
      <Card className="dashboard-card mb-6">
        <CardHeader>
          <CardTitle>Análise de Tendências</CardTitle>
          <CardDescription>Evolução financeira ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fluxo">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="fluxo" className="flex-1 sm:flex-none">
                Fluxo de Caixa
              </TabsTrigger>
              <TabsTrigger value="saldo" className="flex-1 sm:flex-none">
                Saldo Acumulado
              </TabsTrigger>
              <TabsTrigger value="economia" className="flex-1 sm:flex-none">
                Taxa de Economia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fluxo">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
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
                    <Tooltip formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="receitas"
                      name="Receitas"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="despesas"
                      name="Despesas"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="saldo">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData.map((item) => ({
                      ...item,
                      saldo: item.receitas - item.despesas,
                    }))}
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
                    <Tooltip formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="saldo"
                      name="Saldo"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="economia">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData.map((item) => ({
                      ...item,
                      economia: Math.round(((item.receitas - item.despesas) / item.receitas) * 100),
                    }))}
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
                    <Tooltip formatter={(value) => [`${value}%`, "Taxa de Economia"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="economia"
                      name="Taxa de Economia"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Investimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="dashboard-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Desempenho de Investimentos</CardTitle>
            <CardDescription>Análise do desempenho dos seus investimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={investmentData}
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
                  <Bar dataKey="valor" name="Valor Investido" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Resumo de Investimentos</CardTitle>
            <CardDescription>Visão geral da sua carteira</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investmentData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-accent/10 transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">R$ {item.valor.toLocaleString("pt-BR")}</p>
                  </div>
                  <Badge variant={item.crescimento >= 0 ? "success" : "destructive"}>
                    {item.crescimento >= 0 ? "+" : ""}
                    {item.crescimento}%
                  </Badge>
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Investido:</span>
                  <span className="font-bold">
                    R$ {investmentData.reduce((sum, item) => sum + item.valor, 0).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium">Retorno Médio:</span>
                  <span className="font-bold text-success">
                    +
                    {(investmentData.reduce((sum, item) => sum + item.crescimento, 0) / investmentData.length).toFixed(
                      1,
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
