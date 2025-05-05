"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { SortableTable } from "@/components/data-table/sortable-table"

// Sample data for investments
const fixedIncomeInvestments = [
  {
    id: 1,
    name: "Tesouro Direto",
    amount: 10000,
    rate: 5.2,
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    type: "fixed",
  },
  {
    id: 2,
    name: "CDB Banco XYZ",
    amount: 5000,
    rate: 4.8,
    startDate: "2023-02-10",
    endDate: "2023-08-10",
    type: "fixed",
  },
  { id: 3, name: "LCI", amount: 7500, rate: 5.5, startDate: "2023-03-20", endDate: "2024-03-20", type: "fixed" },
]

const variableIncomeInvestments = [
  {
    id: 4,
    name: "ETF de Tecnologia",
    amount: 8000,
    shares: 40,
    currentPrice: 220,
    purchasePrice: 200,
    change: 10,
    type: "variable",
  },
  {
    id: 5,
    name: "Fundo de Índice S&P 500",
    amount: 12000,
    shares: 30,
    currentPrice: 420,
    purchasePrice: 400,
    change: 5,
    type: "variable",
  },
  {
    id: 6,
    name: "Ação com Dividendos",
    amount: 6000,
    shares: 100,
    currentPrice: 65,
    purchasePrice: 60,
    change: 8.33,
    type: "variable",
  },
]

const cryptoInvestments = [
  {
    id: 7,
    name: "Bitcoin",
    amount: 3000,
    quantity: 0.05,
    currentPrice: 60000,
    purchasePrice: 55000,
    change: 9.09,
    type: "crypto",
  },
  {
    id: 8,
    name: "Ethereum",
    amount: 2000,
    quantity: 0.8,
    currentPrice: 2500,
    purchasePrice: 2400,
    change: 4.17,
    type: "crypto",
  },
  {
    id: 9,
    name: "Solana",
    amount: 1000,
    quantity: 10,
    currentPrice: 110,
    purchasePrice: 100,
    change: 10,
    type: "crypto",
  },
]

// Performance data for chart
const performanceData = [
  { month: "Jan", fixedIncome: 2.1, variableIncome: 3.5, crypto: -5.2 },
  { month: "Fev", fixedIncome: 2.3, variableIncome: -1.2, crypto: 10.5 },
  { month: "Mar", fixedIncome: 2.2, variableIncome: 2.8, crypto: -2.1 },
  { month: "Abr", fixedIncome: 2.4, variableIncome: 4.2, crypto: 15.3 },
  { month: "Mai", fixedIncome: 2.3, variableIncome: -2.1, crypto: -8.5 },
  { month: "Jun", fixedIncome: 2.5, variableIncome: 3.7, crypto: 12.8 },
]

// Add sample data for dividends
const dividendHistory = [
  {
    id: 1,
    investmentName: "Ação com Dividendos",
    amount: 120,
    date: "2023-04-15",
    type: "Dividendo",
  },
  {
    id: 2,
    investmentName: "ETF de Tecnologia",
    amount: 85,
    date: "2023-05-10",
    type: "JCP",
  },
  {
    id: 3,
    investmentName: "Ação com Dividendos",
    amount: 130,
    date: "2023-06-15",
    type: "Dividendo",
  },
  {
    id: 4,
    investmentName: "Fundo Imobiliário",
    amount: 200,
    date: "2023-07-05",
    type: "Rendimento",
  },
  {
    id: 5,
    investmentName: "Ação com Dividendos",
    amount: 125,
    date: "2023-08-15",
    type: "Dividendo",
  },
]

// Update the export default function to include dividend functionality
export default function InvestmentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDividendDialogOpen, setIsDividendDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("fixed")

  // Calculate totals
  const totalFixed = fixedIncomeInvestments.reduce((sum, item) => sum + item.amount, 0)
  const totalVariable = variableIncomeInvestments.reduce((sum, item) => sum + item.amount, 0)
  const totalCrypto = cryptoInvestments.reduce((sum, item) => sum + item.amount, 0)
  const totalInvestments = totalFixed + totalVariable + totalCrypto
  const totalDividends = dividendHistory.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestão de Investimentos</h1>
        <div className="flex gap-2">
          <Dialog open={isDividendDialogOpen} onOpenChange={setIsDividendDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Registrar Dividendo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Novo Dividendo</DialogTitle>
                <DialogDescription>Digite os detalhes do dividendo recebido.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="investmentName">Investimento</Label>
                  <Select>
                    <SelectTrigger id="investmentName">
                      <SelectValue placeholder="Selecione o investimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acaoDividendos">Ação com Dividendos</SelectItem>
                      <SelectItem value="etfTecnologia">ETF de Tecnologia</SelectItem>
                      <SelectItem value="fundoImobiliario">Fundo Imobiliário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input id="amount" type="number" placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data de Recebimento</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dividendType">Tipo</Label>
                  <Select>
                    <SelectTrigger id="dividendType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dividendo">Dividendo</SelectItem>
                      <SelectItem value="jcp">JCP</SelectItem>
                      <SelectItem value="rendimento">Rendimento</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input id="notes" placeholder="Observações adicionais" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDividendDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDividendDialogOpen(false)}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Investimento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Investimento</DialogTitle>
                <DialogDescription>Digite os detalhes do seu novo investimento.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="investmentType">Tipo de Investimento</Label>
                  <Select>
                    <SelectTrigger id="investmentType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Renda Fixa</SelectItem>
                      <SelectItem value="variable">Renda Variável</SelectItem>
                      <SelectItem value="crypto">Criptomoeda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Investimento</Label>
                  <Input id="name" placeholder="Digite o nome" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input id="amount" type="number" placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data de Compra</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate">Taxa de Juros / Quantidade</Label>
                    <Input id="rate" type="number" placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maturity">Data de Vencimento / Preço de Compra</Label>
                    <Input id="maturity" type="text" placeholder="Digite o valor" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dividendEligible">Elegível para Dividendos</Label>
                  <Select>
                    <SelectTrigger id="dividendEligible">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Sim</SelectItem>
                      <SelectItem value="no">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalInvestments.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">Em todos os tipos de investimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Renda Fixa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalFixed.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">
              {((totalFixed / totalInvestments) * 100).toFixed(1)}% da carteira
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Renda Variável</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalVariable.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">
              {((totalVariable / totalInvestments) * 100).toFixed(1)}% da carteira
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dividendos (Ano)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalDividends.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">
              Rendimento de {((totalDividends / totalInvestments) * 100).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Histórico de Desempenho</CardTitle>
          <CardDescription>Desempenho mensal por tipo de investimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Legend />
                <Line type="monotone" dataKey="fixedIncome" name="Renda Fixa" stroke="#4ade80" strokeWidth={2} />
                <Line type="monotone" dataKey="variableIncome" name="Renda Variável" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="crypto" name="Criptomoedas" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes dos Investimentos</CardTitle>
          <CardDescription>Detalhamento dos seus investimentos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fixed" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="fixed">Renda Fixa</TabsTrigger>
              <TabsTrigger value="variable">Renda Variável</TabsTrigger>
              <TabsTrigger value="crypto">Criptomoedas</TabsTrigger>
              <TabsTrigger value="dividends">Dividendos</TabsTrigger>
            </TabsList>

            <TabsContent value="fixed">
              <SortableTable
                columns={[
                  {
                    id: "name",
                    header: "Nome",
                    accessorKey: "name",
                  },
                  {
                    id: "amount",
                    header: "Valor",
                    accessorKey: "amount",
                    cell: (row) => `R$ ${row.amount.toLocaleString("pt-BR")}`,
                  },
                  {
                    id: "rate",
                    header: "Taxa de Juros",
                    accessorKey: "rate",
                    cell: (row) => `${row.rate}%`,
                  },
                  {
                    id: "startDate",
                    header: "Data Inicial",
                    accessorKey: "startDate",
                    cell: (row) => new Date(row.startDate).toLocaleDateString("pt-BR"),
                  },
                  {
                    id: "endDate",
                    header: "Data de Vencimento",
                    accessorKey: "endDate",
                    cell: (row) => new Date(row.endDate).toLocaleDateString("pt-BR"),
                  },
                ]}
                data={fixedIncomeInvestments}
              />
            </TabsContent>

            <TabsContent value="variable">
              <SortableTable
                columns={[
                  {
                    id: "name",
                    header: "Nome",
                    accessorKey: "name",
                  },
                  {
                    id: "amount",
                    header: "Valor",
                    accessorKey: "amount",
                    cell: (row) => `R$ ${row.amount.toLocaleString("pt-BR")}`,
                  },
                  {
                    id: "shares",
                    header: "Ações",
                    accessorKey: "shares",
                  },
                  {
                    id: "currentPrice",
                    header: "Preço Atual",
                    accessorKey: "currentPrice",
                    cell: (row) => `R$ ${row.currentPrice}`,
                  },
                  {
                    id: "purchasePrice",
                    header: "Preço de Compra",
                    accessorKey: "purchasePrice",
                    cell: (row) => `R$ ${row.purchasePrice}`,
                  },
                  {
                    id: "change",
                    header: "Variação",
                    accessorKey: "change",
                    cell: (row) => (
                      <div className="flex items-center">
                        {row.change > 0 ? (
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                        )}
                        <span className={row.change > 0 ? "text-green-500" : "text-red-500"}>
                          {row.change > 0 ? "+" : ""}
                          {row.change}%
                        </span>
                      </div>
                    ),
                  },
                ]}
                data={variableIncomeInvestments}
              />
            </TabsContent>

            <TabsContent value="crypto">
              <SortableTable
                columns={[
                  {
                    id: "name",
                    header: "Nome",
                    accessorKey: "name",
                  },
                  {
                    id: "amount",
                    header: "Valor",
                    accessorKey: "amount",
                    cell: (row) => `R$ ${row.amount.toLocaleString("pt-BR")}`,
                  },
                  {
                    id: "quantity",
                    header: "Quantidade",
                    accessorKey: "quantity",
                  },
                  {
                    id: "currentPrice",
                    header: "Preço Atual",
                    accessorKey: "currentPrice",
                    cell: (row) => `R$ ${row.currentPrice.toLocaleString("pt-BR")}`,
                  },
                  {
                    id: "purchasePrice",
                    header: "Preço de Compra",
                    accessorKey: "purchasePrice",
                    cell: (row) => `R$ ${row.purchasePrice.toLocaleString("pt-BR")}`,
                  },
                  {
                    id: "change",
                    header: "Variação",
                    accessorKey: "change",
                    cell: (row) => (
                      <div className="flex items-center">
                        {row.change > 0 ? (
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                        )}
                        <span className={row.change > 0 ? "text-green-500" : "text-red-500"}>
                          {row.change > 0 ? "+" : ""}
                          {row.change}%
                        </span>
                      </div>
                    ),
                  },
                ]}
                data={cryptoInvestments}
              />
            </TabsContent>

            <TabsContent value="dividends">
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Histórico de Dividendos</h3>
                  <p className="text-sm text-muted-foreground">Acompanhe todos os dividendos recebidos</p>
                </div>
                <Button variant="outline" onClick={() => setIsDividendDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Dividendo
                </Button>
              </div>

              <SortableTable
                columns={[
                  {
                    id: "investmentName",
                    header: "Investimento",
                    accessorKey: "investmentName",
                  },
                  {
                    id: "amount",
                    header: "Valor",
                    accessorKey: "amount",
                    cell: (row) => `R$ ${row.amount.toLocaleString("pt-BR")}`,
                  },
                  {
                    id: "date",
                    header: "Data",
                    accessorKey: "date",
                    cell: (row) => new Date(row.date).toLocaleDateString("pt-BR"),
                  },
                  {
                    id: "type",
                    header: "Tipo",
                    accessorKey: "type",
                  },
                ]}
                data={dividendHistory}
              />

              <div className="mt-4 pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total de Dividendos:</span>
                  <span className="font-bold text-green-500">
                    R$ {dividendHistory.reduce((sum, item) => sum + item.amount, 0).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
