"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Filter, Search, Check, X, MoreHorizontal, Pencil, Trash, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { SortableTable, type ColumnDef } from "@/components/data-table/sortable-table"
import { CategoryService, type Category } from "@/services/category-service"
import { Switch } from "@/components/ui/switch"

// Types for receivables
type RecurrenceType = "none" | "daily" | "weekly" | "biweekly" | "monthly" | "yearly"

type Receivable = {
  id: number
  description: string
  amount: number
  date: string
  category: string
  categoryId: string
  status: "received" | "pending"
  recurrence?: {
    type: RecurrenceType
    endDate?: string
    occurrences?: number
    currentOccurrence?: number
  }
}

// Sample data
const sampleReceivables: Receivable[] = [
  {
    id: 1,
    description: "Pagamento de Cliente - ABC Corp",
    amount: 1500,
    date: "2023-04-15",
    category: "Consultoria",
    categoryId: "12", // This will be replaced by actual category ID
    status: "received",
  },
  {
    id: 2,
    description: "Projeto Freelance",
    amount: 800,
    date: "2023-04-20",
    category: "Serviços",
    categoryId: "13", // This will be replaced by actual category ID
    status: "pending",
  },
  {
    id: 3,
    description: "Pagamento de Dividendos",
    amount: 350,
    date: "2023-04-25",
    category: "Investimento",
    categoryId: "8",
    status: "received",
  },
  {
    id: 4,
    description: "Mensalidade de Cliente - XYZ Inc",
    amount: 2000,
    date: "2023-05-01",
    category: "Consultoria",
    categoryId: "12", // This will be replaced by actual category ID
    status: "pending",
  },
  {
    id: 5,
    description: "Venda de Produto",
    amount: 450,
    date: "2023-05-05",
    category: "Vendas",
    categoryId: "14", // This will be replaced by actual category ID
    status: "pending",
  },
  {
    id: 6,
    description: "Comissão de Afiliado",
    amount: 120,
    date: "2023-05-10",
    category: "Marketing",
    categoryId: "15", // This will be replaced by actual category ID
    status: "received",
  },
]

// Let's ensure we have all the income categories available
const additionalIncomeCategories = [
  {
    id: "12",
    name: "Consultoria",
    description: "Receitas de serviços de consultoria",
    type: "income",
    color: "#3b82f6",
    count: 2,
  },
  {
    id: "13",
    name: "Serviços",
    description: "Receitas de serviços prestados",
    type: "income",
    color: "#10b981",
    count: 1,
  },
  {
    id: "14",
    name: "Vendas",
    description: "Receitas de vendas de produtos",
    type: "income",
    color: "#f59e0b",
    count: 1,
  },
  {
    id: "15",
    name: "Marketing",
    description: "Receitas de marketing e afiliados",
    type: "income",
    color: "#8b5cf6",
    count: 1,
  },
]

export default function AccountsReceivablePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [receivablesList, setReceivablesList] = useState<Receivable[]>(sampleReceivables)
  const [currentReceivable, setCurrentReceivable] = useState<Receivable | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const isMobile = useIsMobile()

  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("monthly")
  const [recurrenceEndType, setRecurrenceEndType] = useState<"date" | "occurrences">("date")
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("")
  const [recurrenceOccurrences, setRecurrenceOccurrences] = useState(12)

  // Load categories on component mount
  useEffect(() => {
    const incomeCategories = CategoryService.getAllByType("income")

    // Add any missing income categories that are in our sample data
    for (const category of additionalIncomeCategories) {
      if (!incomeCategories.find((c) => c.id === category.id)) {
        CategoryService.create({
          name: category.name,
          description: category.description,
          type: "income",
          color: category.color,
        })
      }
    }

    // Reload categories after ensuring they exist
    setCategories(CategoryService.getAllByType("income"))
  }, [])

  // Filter the receivables based on search term and filters
  const filteredReceivables = receivablesList.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.categoryId === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Function to handle status change
  const handleStatusChange = (id: number, newStatus: "received" | "pending") => {
    setReceivablesList(receivablesList.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))

    toast({
      title: "Status atualizado",
      description: `A conta foi marcada como ${newStatus === "received" ? "recebida" : "pendente"}.`,
    })
  }

  // Function to handle adding a new receivable
  const handleAddReceivable = (formData: FormData) => {
    const description = formData.get("description") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const date = formData.get("date") as string
    const categoryId = formData.get("category") as string
    const status = formData.get("status") as "received" | "pending"

    // Find category name
    const category = categories.find((c) => c.id === categoryId)?.name || ""

    // Create new receivable
    const newReceivable: Receivable = {
      id: Math.max(0, ...receivablesList.map((r) => r.id)) + 1,
      description,
      amount,
      date,
      category,
      categoryId,
      status,
    }

    // Add recurrence if enabled
    if (isRecurring) {
      newReceivable.recurrence = {
        type: recurrenceType,
      }

      if (recurrenceEndType === "date") {
        newReceivable.recurrence.endDate = recurrenceEndDate
      } else {
        newReceivable.recurrence.occurrences = recurrenceOccurrences
        newReceivable.recurrence.currentOccurrence = 1
      }
    }

    setReceivablesList([...receivablesList, newReceivable])
    setIsDialogOpen(false)

    // Reset recurrence state
    setIsRecurring(false)
    setRecurrenceType("monthly")
    setRecurrenceEndType("date")
    setRecurrenceEndDate("")
    setRecurrenceOccurrences(12)

    toast({
      title: "Conta adicionada",
      description: "A nova conta a receber foi adicionada com sucesso.",
    })

    // Update category count
    if (categoryId) {
      CategoryService.incrementCount(categoryId)
    }
  }

  // Function to handle editing a receivable
  const handleEditReceivable = (formData: FormData) => {
    if (!currentReceivable) return

    const description = formData.get("description") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const date = formData.get("date") as string
    const categoryId = formData.get("category") as string
    const status = formData.get("status") as "received" | "pending"

    // Find category name
    const category = categories.find((c) => c.id === categoryId)?.name || ""

    // Create updated receivable
    const updatedReceivable: Receivable = {
      ...currentReceivable,
      description,
      amount,
      date,
      category,
      categoryId,
      status,
    }

    // Update recurrence if enabled
    if (isRecurring) {
      updatedReceivable.recurrence = {
        type: recurrenceType,
      }

      if (recurrenceEndType === "date") {
        updatedReceivable.recurrence.endDate = recurrenceEndDate
      } else {
        updatedReceivable.recurrence.occurrences = recurrenceOccurrences
        updatedReceivable.recurrence.currentOccurrence = updatedReceivable.recurrence?.currentOccurrence || 1
      }
    } else {
      delete updatedReceivable.recurrence
    }

    // Update receivables list
    const updatedReceivables = receivablesList.map((item) =>
      item.id === currentReceivable.id ? updatedReceivable : item,
    )

    setReceivablesList(updatedReceivables)
    setIsEditDialogOpen(false)
    setCurrentReceivable(null)

    // Reset recurrence state
    setIsRecurring(false)
    setRecurrenceType("monthly")
    setRecurrenceEndType("date")
    setRecurrenceEndDate("")
    setRecurrenceOccurrences(12)

    toast({
      title: "Conta atualizada",
      description: "A conta a receber foi atualizada com sucesso.",
    })

    // Update category count if category changed
    if (categoryId !== currentReceivable.categoryId) {
      if (currentReceivable.categoryId) {
        CategoryService.decrementCount(currentReceivable.categoryId)
      }
      if (categoryId) {
        CategoryService.incrementCount(categoryId)
      }
    }
  }

  // Function to handle deleting a receivable
  const handleDeleteReceivable = () => {
    if (!currentReceivable) return

    // Update category count
    if (currentReceivable.categoryId) {
      CategoryService.decrementCount(currentReceivable.categoryId)
    }

    const updatedReceivables = receivablesList.filter((item) => item.id !== currentReceivable.id)

    setReceivablesList(updatedReceivables)
    setIsDeleteDialogOpen(false)
    setCurrentReceivable(null)

    toast({
      title: "Conta excluída",
      description: "A conta a receber foi excluída com sucesso.",
    })
  }

  // Function to open delete dialog
  const openDeleteDialog = (receivable: Receivable) => {
    setCurrentReceivable(receivable)
    setIsDeleteDialogOpen(true)
  }

  // Function to open edit dialog
  const openEditDialog = (receivable: Receivable) => {
    setCurrentReceivable(receivable)

    // Set recurrence state based on receivable
    if (receivable.recurrence) {
      setIsRecurring(true)
      setRecurrenceType(receivable.recurrence.type)

      if (receivable.recurrence.endDate) {
        setRecurrenceEndType("date")
        setRecurrenceEndDate(receivable.recurrence.endDate)
      } else if (receivable.recurrence.occurrences) {
        setRecurrenceEndType("occurrences")
        setRecurrenceOccurrences(receivable.recurrence.occurrences)
      }
    } else {
      setIsRecurring(false)
      setRecurrenceType("monthly")
      setRecurrenceEndType("date")
      setRecurrenceEndDate("")
      setRecurrenceOccurrences(12)
    }

    setIsEditDialogOpen(true)
  }

  // Define columns for the sortable table
  const columns: ColumnDef[] = [
    {
      id: "description",
      header: "Descrição",
      accessorKey: "description",
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
      enableSorting: !isMobile,
    },
    {
      id: "category",
      header: "Categoria",
      accessorKey: "category",
      enableSorting: !isMobile,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <Badge
          variant={row.status === "received" ? "success" : "outline"}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handleStatusChange(row.id, row.status === "received" ? "pending" : "received")
          }}
        >
          {row.status === "received" ? "Recebido" : "Pendente"}
        </Badge>
      ),
    },
    {
      id: "recurrence",
      header: "Recorrência",
      accessorKey: "recurrence",
      cell: (row) =>
        row.recurrence ? (
          <Badge variant="secondary" className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 mr-1" />
            {row.recurrence.type === "daily" && "Diária"}
            {row.recurrence.type === "weekly" && "Semanal"}
            {row.recurrence.type === "biweekly" && "Quinzenal"}
            {row.recurrence.type === "monthly" && "Mensal"}
            {row.recurrence.type === "yearly" && "Anual"}
            {row.recurrence.currentOccurrence &&
              row.recurrence.occurrences &&
              ` (${row.recurrence.currentOccurrence}/${row.recurrence.occurrences})`}
          </Badge>
        ) : (
          "—"
        ),
      enableSorting: !isMobile,
    },
    {
      id: "actions",
      header: "Ações",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusChange(row.id, "received")}>
                <Check className="mr-2 h-4 w-4" />
                Marcar como Recebido
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(row.id, "pending")}>
                <X className="mr-2 h-4 w-4" />
                Marcar como Pendente
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditDialog(row)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteDialog(row)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
    },
  ]

  // Mobile columns (reduced set)
  const mobileColumns = columns.filter((col) => ["description", "amount", "status", "actions"].includes(col.id))

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Contas a Receber</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Adicionar Novo</span>
              <span className="sm:hidden">Adicionar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Conta a Receber</DialogTitle>
              <DialogDescription>Digite os detalhes da nova conta a receber.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddReceivable(new FormData(e.currentTarget))
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" name="description" placeholder="Digite a descrição" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input id="amount" name="amount" type="number" placeholder="0,00" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select name="category" defaultValue={categories[0]?.id}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="pending">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="received">Recebido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Recurrence options */}
                <div className="space-y-4 pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Switch id="is-recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                    <Label htmlFor="is-recurring">Pagamento Recorrente</Label>
                  </div>

                  {isRecurring && (
                    <div className="space-y-4 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="recurrence-type">Frequência</Label>
                        <Select
                          value={recurrenceType}
                          onValueChange={(value) => setRecurrenceType(value as RecurrenceType)}
                        >
                          <SelectTrigger id="recurrence-type">
                            <SelectValue placeholder="Selecione a frequência" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diária</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="biweekly">Quinzenal</SelectItem>
                            <SelectItem value="monthly">Mensal</SelectItem>
                            <SelectItem value="yearly">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Duração</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="end-by-date"
                            name="recurrence-end-type"
                            checked={recurrenceEndType === "date"}
                            onChange={() => setRecurrenceEndType("date")}
                          />
                          <Label htmlFor="end-by-date" className="font-normal">
                            Até data específica
                          </Label>
                        </div>

                        {recurrenceEndType === "date" && (
                          <div className="pl-6 pt-2">
                            <Input
                              type="date"
                              value={recurrenceEndDate}
                              onChange={(e) => setRecurrenceEndDate(e.target.value)}
                            />
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="end-by-occurrences"
                            name="recurrence-end-type"
                            checked={recurrenceEndType === "occurrences"}
                            onChange={() => setRecurrenceEndType("occurrences")}
                          />
                          <Label htmlFor="end-by-occurrences" className="font-normal">
                            Número de ocorrências
                          </Label>
                        </div>

                        {recurrenceEndType === "occurrences" && (
                          <div className="pl-6 pt-2">
                            <Input
                              type="number"
                              min="1"
                              value={recurrenceOccurrences}
                              onChange={(e) => setRecurrenceOccurrences(Number.parseInt(e.target.value))}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Conta a Receber</DialogTitle>
              <DialogDescription>Atualize os detalhes da conta a receber.</DialogDescription>
            </DialogHeader>
            {currentReceivable && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleEditReceivable(new FormData(e.currentTarget))
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Descrição</Label>
                    <Input
                      id="edit-description"
                      name="description"
                      defaultValue={currentReceivable.description}
                      placeholder="Digite a descrição"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-amount">Valor</Label>
                      <Input
                        id="edit-amount"
                        name="amount"
                        type="number"
                        defaultValue={currentReceivable.amount}
                        placeholder="0,00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-date">Data</Label>
                      <Input id="edit-date" name="date" type="date" defaultValue={currentReceivable.date} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Categoria</Label>
                      <Select name="category" defaultValue={currentReceivable.categoryId}>
                        <SelectTrigger id="edit-category">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select name="status" defaultValue={currentReceivable.status}>
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="received">Recebido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Recurrence options for edit */}
                  <div className="space-y-4 pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Switch id="edit-is-recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                      <Label htmlFor="edit-is-recurring">Pagamento Recorrente</Label>
                    </div>

                    {isRecurring && (
                      <div className="space-y-4 pl-6">
                        <div className="space-y-2">
                          <Label htmlFor="edit-recurrence-type">Frequência</Label>
                          <Select
                            value={recurrenceType}
                            onValueChange={(value) => setRecurrenceType(value as RecurrenceType)}
                          >
                            <SelectTrigger id="edit-recurrence-type">
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Diária</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="biweekly">Quinzenal</SelectItem>
                              <SelectItem value="monthly">Mensal</SelectItem>
                              <SelectItem value="yearly">Anual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Duração</Label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="edit-end-by-date"
                              name="edit-recurrence-end-type"
                              checked={recurrenceEndType === "date"}
                              onChange={() => setRecurrenceEndType("date")}
                            />
                            <Label htmlFor="edit-end-by-date" className="font-normal">
                              Até data específica
                            </Label>
                          </div>

                          {recurrenceEndType === "date" && (
                            <div className="pl-6 pt-2">
                              <Input
                                type="date"
                                value={recurrenceEndDate}
                                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                              />
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="edit-end-by-occurrences"
                              name="edit-recurrence-end-type"
                              checked={recurrenceEndType === "occurrences"}
                              onChange={() => setRecurrenceEndType("occurrences")}
                            />
                            <Label htmlFor="edit-end-by-occurrences" className="font-normal">
                              Número de ocorrências
                            </Label>
                          </div>

                          {recurrenceEndType === "occurrences" && (
                            <div className="pl-6 pt-2">
                              <Input
                                type="number"
                                min="1"
                                value={recurrenceOccurrences}
                                onChange={(e) => setRecurrenceOccurrences(Number.parseInt(e.target.value))}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Conta a Receber</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta conta a receber? Esta ação não pode ser desfeita.
                {currentReceivable?.recurrence && (
                  <div className="mt-2 font-medium text-destructive">
                    Atenção: Esta é uma conta recorrente. Todos os pagamentos futuros também serão excluídos.
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteReceivable}
                className="bg-destructive text-destructive-foreground"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="received">Recebido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <SortableTable
            columns={isMobile ? mobileColumns : columns}
            data={filteredReceivables}
            onRowClick={openEditDialog}
          />
        </CardContent>
      </Card>
    </div>
  )
}
