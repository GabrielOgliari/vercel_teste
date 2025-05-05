"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { toast } from "@/components/ui/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

// Sample data for budget categories
const initialCategories = [
  { id: "moradia", name: "Moradia", planned: 2000, actual: 0 },
  { id: "alimentacao", name: "Alimentação", planned: 600, actual: 0 },
  { id: "transporte", name: "Transporte", planned: 400, actual: 0 },
  { id: "utilidades", name: "Utilidades", planned: 300, actual: 0 },
  { id: "lazer", name: "Lazer", planned: 200, actual: 0 },
  { id: "saude", name: "Saúde", planned: 150, actual: 0 },
  { id: "poupanca", name: "Poupança", planned: 500, actual: 0 },
  { id: "diversos", name: "Diversos", planned: 150, actual: 0 },
]

// Sample data for expenses from OFX file
const bankStatementExpenses = [
  {
    id: "aluguel",
    name: "ALUGUEL IMOBILIARIA XYZ",
    amount: 1800,
    date: "2023-05-01",
    mapped: false,
    category: "moradia",
  },
  {
    id: "condominio",
    name: "CONDOMINIO EDIFICIO CENTRAL",
    amount: 200,
    date: "2023-05-05",
    mapped: false,
    category: "moradia",
  },
  {
    id: "mercado1",
    name: "SUPERMERCADO PAO DE ACUCAR",
    amount: 350,
    date: "2023-05-03",
    mapped: false,
    category: "alimentacao",
  },
  {
    id: "mercado2",
    name: "SUPERMERCADO EXTRA",
    amount: 180,
    date: "2023-05-15",
    mapped: false,
    category: "alimentacao",
  },
  {
    id: "restaurante1",
    name: "RESTAURANTE SABOR E ARTE",
    amount: 120,
    date: "2023-05-10",
    mapped: false,
    category: "alimentacao",
  },
  { id: "uber1", name: "UBER *TRIP", amount: 45, date: "2023-05-04", mapped: false, category: "transporte" },
  { id: "uber2", name: "UBER *TRIP", amount: 38, date: "2023-05-12", mapped: false, category: "transporte" },
  { id: "metro", name: "METRO SP", amount: 100, date: "2023-05-01", mapped: false, category: "transporte" },
  { id: "luz", name: "ENEL ENERGIA", amount: 150, date: "2023-05-10", mapped: false, category: "utilidades" },
  { id: "agua", name: "SABESP", amount: 80, date: "2023-05-15", mapped: false, category: "utilidades" },
  { id: "internet", name: "VIVO INTERNET", amount: 90, date: "2023-05-05", mapped: false, category: "utilidades" },
  { id: "netflix", name: "NETFLIX.COM", amount: 40, date: "2023-05-08", mapped: false, category: "lazer" },
  { id: "spotify", name: "SPOTIFY", amount: 20, date: "2023-05-08", mapped: false, category: "lazer" },
  { id: "cinema", name: "CINEMARK", amount: 60, date: "2023-05-20", mapped: false, category: "lazer" },
  { id: "farmacia", name: "DROGARIA SAO PAULO", amount: 100, date: "2023-05-18", mapped: false, category: "saude" },
  { id: "academia", name: "SMARTFIT", amount: 80, date: "2023-05-05", mapped: false, category: "saude" },
]

// Sortable item component for expenses
function SortableExpense({ id, name, amount, date, category, onMap }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="expense-item mb-2">
      <div className="flex flex-col">
        <p className="font-medium truncate">{name}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString("pt-BR")}</p>
          <p className="text-lg font-bold">R$ {amount.toLocaleString("pt-BR")}</p>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Categoria sugerida: {category ? category.charAt(0).toUpperCase() + category.slice(1) : "Não definida"}
        </div>
      </div>
    </div>
  )
}

// Droppable category component
function DroppableCategory({ id, name, planned, mappedItems, onRemoveItem }) {
  // Calcular o total atual somando os valores dos itens mapeados
  const totalActual = mappedItems.reduce((sum, item) => sum + item.amount, 0)
  const difference = totalActual - planned
  const isOverBudget = totalActual > planned
  const remaining = planned - totalActual

  return (
    <div
      className={`mb-4 rounded-md border ${
        isOverBudget ? "border-destructive/30" : totalActual > 0 ? "border-success/30" : "border-border"
      } p-3 transition-all duration-200 hover:border-primary/50 hover:shadow-sm`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <h3 className="font-medium">{name}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isOverBudget ? "destructive" : totalActual > 0 ? "success" : "outline"}>
            {totalActual > 0 ? `R$ ${totalActual.toLocaleString("pt-BR")}` : "R$ 0"}
          </Badge>
          <Badge variant="outline">Meta: R$ {planned.toLocaleString("pt-BR")}</Badge>
          <Badge
            variant={remaining < 0 ? "destructive" : "outline"}
            className={remaining < 0 ? "" : "bg-blue-500/10 text-blue-500"}
          >
            Sobra: R$ {remaining.toLocaleString("pt-BR")}
          </Badge>
        </div>
      </div>

      {mappedItems.length > 0 ? (
        <div className="space-y-2 mt-2">
          {mappedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-md border border-border p-2 bg-card/50 hover:bg-accent/20 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium truncate">{item.name}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString("pt-BR")}</p>
                  <p className="font-bold">R$ {item.amount.toLocaleString("pt-BR")}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-8 w-8 text-destructive flex-shrink-0 hover:bg-destructive/10"
                onClick={() => onRemoveItem(item.id)}
              >
                <span className="sr-only">Remover</span>×
              </Button>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
            <span className="font-medium">Total:</span>
            <span className={`font-bold ${isOverBudget ? "text-destructive" : "text-success"}`}>
              R$ {totalActual.toLocaleString("pt-BR")}
              {difference !== 0 && (
                <span className="ml-2 text-sm">
                  ({difference > 0 ? "+" : ""}
                  {difference.toLocaleString("pt-BR")})
                </span>
              )}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">Arraste despesas para esta categoria</p>
        </div>
      )}
    </div>
  )
}

export default function BudgetComparisonPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [expenses, setExpenses] = useState(bankStatementExpenses)
  const [mappedItems, setMappedItems] = useState({})
  const isMobile = useIsMobile()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Calculate totals
  const totalPlanned = categories.reduce((sum, item) => sum + item.planned, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)

  // Calcular o total mapeado somando todos os itens em todas as categorias
  const totalMapped = Object.values(mappedItems)
    .flat()
    .reduce((sum, item) => sum + item.amount, 0)

  const unmappedTotal = totalExpenses - totalMapped
  const mappedPercentage = totalExpenses > 0 ? Math.round((totalMapped / totalExpenses) * 100) : 0

  // Update category actual values when mappedItems change
  useEffect(() => {
    const updatedCategories = categories.map((category) => {
      const categoryExpenses = mappedItems[category.id] || []
      const actual = categoryExpenses.reduce((sum, item) => sum + item.amount, 0)
      return { ...category, actual }
    })

    setCategories(updatedCategories)
  }, [mappedItems])

  // Find categories that are over budget
  const overBudgetCategories = categories.filter((category) => category.actual > category.planned)

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const expenseId = active.id
      const categoryId = over.id

      // Find the expense
      const expense = expenses.find((item) => item.id === expenseId)

      if (expense) {
        // Check if the expense is already mapped to a category
        let alreadyMappedToCategoryId = null
        Object.entries(mappedItems).forEach(([catId, expenses]) => {
          if (expenses.some((item) => item.id === expenseId)) {
            alreadyMappedToCategoryId = catId
          }
        })

        // If already mapped, remove from previous category
        if (alreadyMappedToCategoryId) {
          setMappedItems((prev) => ({
            ...prev,
            [alreadyMappedToCategoryId]: prev[alreadyMappedToCategoryId].filter((item) => item.id !== expenseId),
          }))
        }

        // Mark as mapped
        setExpenses(expenses.map((item) => (item.id === expenseId ? { ...item, mapped: true } : item)))

        // Add to mapped category
        setMappedItems((prev) => ({
          ...prev,
          [categoryId]: [...(prev[categoryId] || []), expense],
        }))

        // Show toast notification
        toast({
          title: "Item mapeado com sucesso",
          description: `${expense.name} foi mapeado para ${categories.find((cat) => cat.id === categoryId)?.name}`,
        })

        // Check if the suggested category matches the mapped category
        if (expense.category && expense.category !== categoryId) {
          toast({
            title: "Categoria diferente da sugerida",
            description: `Este item foi sugerido para ${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}`,
            variant: "destructive",
          })
        }
      }
    }
  }

  const handleRemoveMapping = (expenseId) => {
    // Find which category contains this expense
    let categoryId = null
    let expense = null

    Object.entries(mappedItems).forEach(([catId, expenses]) => {
      const found = expenses.find((item) => item.id === expenseId)
      if (found) {
        categoryId = catId
        expense = found
      }
    })

    if (categoryId && expense) {
      // Remove from mapped category
      setMappedItems((prev) => ({
        ...prev,
        [categoryId]: prev[categoryId].filter((item) => item.id !== expenseId),
      }))

      // Mark as unmapped
      setExpenses(expenses.map((item) => (item.id === expenseId ? { ...item, mapped: false } : item)))

      // Show toast notification
      toast({
        title: "Item removido",
        description: `${expense.name} foi removido da categoria ${categories.find((cat) => cat.id === categoryId)?.name}`,
      })
    }
  }

  const handleAutoMap = () => {
    // Auto-map expenses to their suggested categories
    const newMappedItems = { ...mappedItems }

    expenses.forEach((expense) => {
      if (!expense.mapped && expense.category) {
        // Add to mapped category
        newMappedItems[expense.category] = [...(newMappedItems[expense.category] || []), expense]

        // Mark as mapped
        setExpenses((prev) => prev.map((item) => (item.id === expense.id ? { ...item, mapped: true } : item)))
      }
    })

    setMappedItems(newMappedItems)

    toast({
      title: "Mapeamento automático concluído",
      description: "Os itens foram mapeados para suas categorias sugeridas",
    })
  }

  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6">
      <h1 className="mb-6 text-2xl md:text-3xl font-bold">De Para</h1>

      {overBudgetCategories.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Alerta de Orçamento</AlertTitle>
          <AlertDescription>
            Você tem {overBudgetCategories.length} categorias que estão acima do orçamento planejado. Verifique:{" "}
            {overBudgetCategories.map((c) => c.name).join(", ")}.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-6">
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Planejado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalPlanned.toLocaleString("pt-BR")}</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total do Extrato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalExpenses.toLocaleString("pt-BR")}</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progresso de Mapeamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalMapped.toLocaleString("pt-BR")} / {totalExpenses.toLocaleString("pt-BR")}
            </div>
            <div className="mt-2 h-2 w-full bg-muted overflow-hidden rounded-full">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${mappedPercentage}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {mappedPercentage}% mapeado • R$ {unmappedTotal.toLocaleString("pt-BR")} restante
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAutoMap} variant="outline" className="ml-auto">
          Mapeamento Automático
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          {/* Left Column - Categories */}
          <div className="order-2 lg:order-1">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Categorias</CardTitle>
                <CardDescription>Categorias de despesas planejadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="category-item flex flex-col sm:flex-row justify-between p-2 gap-2"
                    >
                      <span className="font-medium">{category.name}</span>
                      <div className="flex flex-col items-start sm:items-end">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">Meta: R$ {category.planned.toLocaleString("pt-BR")}</Badge>
                          <Badge
                            variant={
                              category.actual > 0
                                ? category.actual > category.planned
                                  ? "destructive"
                                  : "success"
                                : "outline"
                            }
                          >
                            Atual: R$ {category.actual.toLocaleString("pt-BR")}
                          </Badge>
                        </div>
                        <span
                          className={`text-sm mt-1 ${
                            category.actual > category.planned ? "text-destructive" : "text-blue-500"
                          }`}
                        >
                          Sobra: R$ {(category.planned - category.actual).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col sm:flex-row justify-between p-2 font-bold border-t border-border mt-2 pt-4 gap-2">
                    <span>Total</span>
                    <div className="flex flex-col items-start sm:items-end">
                      <span>Planejado: R$ {totalPlanned.toLocaleString("pt-BR")}</span>
                      <span>Atual: R$ {totalMapped.toLocaleString("pt-BR")}</span>
                      <span className={totalPlanned >= totalMapped ? "text-blue-500" : "text-destructive"}>
                        Sobra: R$ {(totalPlanned - totalMapped).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Mapping Interface */}
          <div className="order-1 lg:order-2">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>De Para</CardTitle>
                <CardDescription>Arraste as despesas do extrato para as categorias correspondentes</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto">
                <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  {categories.map((category) => (
                    <DroppableCategory
                      key={category.id}
                      id={category.id}
                      name={category.name}
                      planned={category.planned}
                      mappedItems={mappedItems[category.id] || []}
                      onRemoveItem={handleRemoveMapping}
                    />
                  ))}
                </SortableContext>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bank Statement Expenses */}
          <div className="order-3">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Extrato Bancário</CardTitle>
                <CardDescription>Despesas importadas do arquivo OFX</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto">
                <SortableContext
                  items={expenses.filter((e) => !e.mapped).map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {expenses.filter((e) => !e.mapped).length > 0 ? (
                    expenses
                      .filter((e) => !e.mapped)
                      .map((expense) => (
                        <SortableExpense
                          key={expense.id}
                          id={expense.id}
                          name={expense.name}
                          amount={expense.amount}
                          date={expense.date}
                          category={expense.category}
                        />
                      ))
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">Todas as despesas foram mapeadas</p>
                    </div>
                  )}
                </SortableContext>

                <div className="mt-4 pt-2 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total não mapeado:</span>
                    <span className="font-bold">R$ {unmappedTotal.toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DndContext>

      <div className="mt-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Resumo do Mapeamento</CardTitle>
            <CardDescription>Visão geral de como as despesas foram mapeadas para as categorias</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Planejado</TableHead>
                    <TableHead>Atual</TableHead>
                    <TableHead>Diferença</TableHead>
                    <TableHead>Sobra</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => {
                    const difference = category.actual - category.planned
                    const remaining = category.planned - category.actual
                    const isOverBudget = category.actual > category.planned

                    return (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>R$ {category.planned.toLocaleString("pt-BR")}</TableCell>
                        <TableCell>R$ {category.actual.toLocaleString("pt-BR")}</TableCell>
                        <TableCell
                          className={difference > 0 ? "text-destructive" : difference < 0 ? "text-success" : ""}
                        >
                          {difference > 0 ? "+" : ""}
                          {difference.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className={remaining < 0 ? "text-destructive" : "text-blue-500"}>
                          R$ {remaining.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isOverBudget ? "destructive" : category.actual > 0 ? "success" : "outline"}>
                            {isOverBudget
                              ? "Acima do Orçamento"
                              : category.actual > 0
                                ? "Dentro do Orçamento"
                                : "Não Mapeado"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">R$ {totalPlanned.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="font-bold">R$ {totalMapped.toLocaleString("pt-BR")}</TableCell>
                    <TableCell
                      className={`font-bold ${
                        totalMapped > totalPlanned
                          ? "text-destructive"
                          : totalMapped < totalPlanned
                            ? "text-success"
                            : ""
                      }`}
                    >
                      {totalMapped > totalPlanned ? "+" : ""}
                      {(totalMapped - totalPlanned).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell
                      className={`font-bold ${totalPlanned < totalMapped ? "text-destructive" : "text-blue-500"}`}
                    >
                      R$ {(totalPlanned - totalMapped).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={totalMapped > totalPlanned ? "destructive" : "success"}>
                        {totalMapped > totalPlanned
                          ? "Acima do Orçamento"
                          : totalMapped < totalPlanned
                            ? "Abaixo do Orçamento"
                            : "No Orçamento"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
