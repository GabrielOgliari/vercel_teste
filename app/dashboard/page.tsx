"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, TrendingUp } from "lucide-react"
import { ExpensesPieChart } from "@/components/dashboard/expenses-pie-chart"
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart"
import { InvestmentSummary } from "@/components/dashboard/investment-summary"

export default function DashboardPage() {
  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 24.231,89</div>
            <p className="text-xs text-muted-foreground">+R$ 1.204,75 em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Receber</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5.231,89</div>
            <p className="text-xs text-muted-foreground">3 pagamentos pendentes</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.450,00</div>
            <p className="text-xs text-muted-foreground">5 contas próximas</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 42.891,37</div>
            <p className="text-xs text-muted-foreground">+8,2% de retorno geral</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 dashboard-card">
          <CardHeader>
            <CardTitle>Despesas Mensais</CardTitle>
            <CardDescription>Detalhamento das suas despesas por categoria</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ExpensesPieChart />
          </CardContent>
        </Card>

        <Card className="col-span-1 dashboard-card">
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
            <CardDescription>Receitas vs. despesas para o mês atual</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <CashFlowChart />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Carteira de Investimentos</CardTitle>
            <CardDescription>Resumo do desempenho dos seus investimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Resumo</TabsTrigger>
                <TabsTrigger value="fixed">Renda Fixa</TabsTrigger>
                <TabsTrigger value="variable">Renda Variável</TabsTrigger>
                <TabsTrigger value="crypto">Criptomoedas</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <InvestmentSummary />
              </TabsContent>
              <TabsContent value="fixed">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">Detalhes de Renda Fixa</h3>
                  <p className="text-muted-foreground">CDBs, Tesouro Direto e outros investimentos de renda fixa</p>
                </div>
              </TabsContent>
              <TabsContent value="variable">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">Detalhes de Renda Variável</h3>
                  <p className="text-muted-foreground">Ações, Fundos e outros investimentos de renda variável</p>
                </div>
              </TabsContent>
              <TabsContent value="crypto">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">Detalhes de Criptomoedas</h3>
                  <p className="text-muted-foreground">Bitcoin, Ethereum e outras criptomoedas</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
