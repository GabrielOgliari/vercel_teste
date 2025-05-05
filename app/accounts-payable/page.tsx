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
import { Switch } from "@/components/ui/switch"
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

// Types for payables
type RecurrenceType = "none" | "daily" | "weekly" | "biweekly" | "monthly" | "yearly"

type Payable = {
  id: number
  description: string
  amount: number
  dueDate: string
  category: string
  categoryId: string
  status: "pending" | "paid"
  reminder: boolean
  recurrence?: {
    type: RecurrenceType
    endDate?: string
    occurrences?: number
    currentOccurrence?: number
  }
}

// Sample data
const samplePayables: Payable[] = [
  {
    id: 1,
    description: "Pagamento de Aluguel",
    amount: 2000,
    dueDate: "2023-05-01",
    category: "Moradia",
    categoryId: "1",
    status: "pending",
    reminder: true,
    recurrence: {
      type: "monthly",
      endDate: "2023-12-01",
    },
  },
  {
    id: 2,
    description: "Conta de Internet",
    amount: 80,
    dueDate: "2023-05-05",
    category: "Utilidades",
    categoryId: "9",
    status: "pending",
    reminder: true,
  },
  {
    id: 3,
    description: "Pagamento de Cartão de Crédito",
    amount: 450,
    dueDate: "2023-05-10",
    category: "Dívidas",
    categoryId: "10",
    status: "paid",
    reminder: false,
  },
  {
    id: 4,
    description: "Seguro do Carro",
    amount: 120,
    dueDate: "2023-05-15",
    category: "Seguros",
    categoryId: "11",
    status: "pending",
    reminder: true,
    recurrence: {
      type: "monthly",
      occurrences: 12,
      currentOccurrence: 5,
    },
  },
  {
    id: 5,
    description: "Mensalidade da Academia",
    amount: 50,
    dueDate: "2023-05-20",
    category: "Saúde",
    categoryId: "5",
    status: "paid",
    reminder: false,
    recurrence: {
      type: "monthly",
      occurrences: 12,
      currentOccurrence: 3,
    },
  },
  {
    id: 6,
    description: "Conta de Telefone",
    amount: 65,
    dueDate: "2023-05-25",
    category: "Utilidades",
    categoryId: "9",
    status: "pending",
    reminder: true,
  },
]

export default function AccountsPayablePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [payablesList, setPayablesList] = useState<Payable[]>(samplePayables)
  const [currentPayable, setCurrentPayable] = useState<Payable | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("monthly")
  const [recurrenceEndType, setRecurrenceEndType] = useState<"date" | "occurrences">("date")
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("")
  const [recurrenceOccurrences, setRecurrenceOccurrences] = useState(12)

  const isMobile = useIsMobile()

  // Load categories on component mount
  useEffect(() => {
    const expenseCategories = CategoryService.getAllByType("expense")
    setCategories(expenseCategories)
  }, [])

  // Filter the payables based on search term and filters
  const filteredPayables = payablesList.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.categoryId === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Function to handle status change
  const handleStatusChange = (id: number, newStatus: "paid" | "pending") => {
    setPayablesList(payablesList.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))

    toast({
      title: "Status atualizado",
      description: `A conta foi marcada como ${newStatus === "paid" ? "paga" : "pendente"}.`,
    })
  }

  // Function to handle adding a new payable
  const handleAddPayable = (formData: FormData) => {
    const description = formData.get("description") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const dueDate = formData.get("dueDate") as string
    const categoryId = formData.get("category") as string
    const status = formData.get("status") as "pending" | "paid"
    const reminder = formData.get("reminder") === "on"

    // Find category name
    const category = categories.find((c) => c.id === categoryId)?.name || ""

    // Create new payable
    const newPayable: Payable = {
      id: Math.max(0, ...payablesList.map((p) => p.id)) + 1,
      description,
      amount,
      dueDate,
      category,
      categoryId,
      status,
      reminder,
    }

    // Add recurrence if enabled
    if (isRecurring) {
      newPayable.recurrence = {
        type: recurrenceType,
      }

      if (recurrenceEndType === "date") {
        newPayable.recurrence.endDate = recurrenceEndDate
      } else {
        newPayable.recurrence.occurrences = recurrenceOccurrences
        newPayable.recurrence.currentOccurrence = 1
      }
    }

    setPayablesList([...payablesList, newPayable])
    setIsDialogOpen(false)

    // Reset recurrence state
    setIsRecurring(false)
    setRecurrenceType("monthly")
    setRecurrenceEndType("date")
    setRecurrenceEndDate("")
    setRecurrenceOccurrences(12)

    toast({
      title: "Conta adicionada",
      description: "A nova conta a pagar foi adicionada com sucesso.",
    })

    // Update category count
    if (categoryId) {
      CategoryService.incrementCount(categoryId)
    }
  }

  // Function to handle editing a payable
  const handleEditPayable = (formData: FormData) => {
    if (!currentPayable) return

    const description = formData.get("description") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const dueDate = formData.get("dueDate") as string
    const categoryId = formData.get("category") as string
    const status = formData.get("status") as "pending" | "paid"
    const reminder = formData.get("reminder") === "on"

    // Find category name
    const category = categories.find((c) => c.id === categoryId)?.name || ""

    // Create updated payable
    const updatedPayable: Payable = {
      ...currentPayable,
      description,
      amount,
      dueDate,
      category,
      categoryId,
      status,
      reminder,
    }

    // Update recurrence if enabled
    if (isRecurring) {
      updatedPayable.recurrence = {
        type: recurrenceType,
      }

      if (recurrenceEndType === "date") {
        updatedPayable.recurrence.endDate = recurrenceEndDate
      } else {
        updatedPayable.recurrence.occurrences = recurrenceOccurrences
        updatedPayable.recurrence.currentOccurrence = updatedPayable.recurrence?.currentOccurrence || 1
      }
    } else {
      delete updatedPayable.recurrence
    }

    // Update payables list
    const updatedPayables = payablesList.map((item) => (item.id === currentPayable.id ? updatedPayable : item))

    setPayablesList(updatedPayables)
    setIsEditDialogOpen(false)
    setCurrentPayable(null)

    // Reset recurrence state
    setIsRecurring(false)
    setRecurrenceType("monthly")
    setRecurrenceEndType("date")
    setRecurrenceEndDate("")
    setRecurrenceOccurrences(12)

    toast({
      title: "Conta atualizada",
      description: "A conta a pagar foi atualizada com sucesso.",
    })

    // Update category count if category changed
    if (categoryId !== currentPayable.categoryId) {
      if (currentPayable.categoryId) {
        CategoryService.decrementCount(currentPayable.categoryId)
      }
      if (categoryId) {
        CategoryService.incrementCount(categoryId)
      }
    }
  }

  // Function to handle deleting a payable
  const handleDeletePayable = () => {
    if (!currentPayable) return

    // Update category count
    if (currentPayable.categoryId) {
      CategoryService.decrementCount(currentPayable.categoryId)
    }

    const updatedPayables = payablesList.filter((item) => item.id !== currentPayable.id)

    setPayablesList(updatedPayables)
    setIsDeleteDialogOpen(false)
    setCurrentPayable(null)

    toast({
      title: "Conta excluída",
      description: "A conta a pagar foi excluída com sucesso.",
    })
  }

  // Function to open edit dialog
  const openEditDialog = (payable: Payable) => {
    setCurrentPayable(payable)

    // Set recurrence state based on payable
    if (payable.recurrence) {
      setIsRecurring(true)
      setRecurrenceType(payable.recurrence.type)

      if (payable.recurrence.endDate) {
        setRecurrenceEndType("date")
        setRecurrenceEndDate(payable.recurrence.endDate)
      } else if (payable.recurrence.occurrences) {
        setRecurrenceEndType("occurrences")
        setRecurrenceOccurrences(payable.recurrence.occurrences)
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

  // Function to open delete dialog
  const openDeleteDialog = (payable: Payable) => {
    setCurrentPayable(payable)
    setIsDeleteDialogOpen(true)
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
      id: "dueDate",
      header: "Data de Vencimento",
      accessorKey: "dueDate",
      cell: (row) => new Date(row.dueDate).toLocaleDateString("pt-BR"),
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
          variant={row.status === "paid" ? "success" : "outline"}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handleStatusChange(row.id, row.status === "paid" ? "pending" : "paid")
          }}
        >
          {row.status === "paid" ? "Pago" : "Pendente"}
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
              <DropdownMenuItem onClick={() => handleStatusChange(row.id, "paid")}>
                <Check className="mr-2 h-4 w-4" />
                Marcar como Pago
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
    <div className="h-full w-full overflow-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Contas a Pagar</h1>
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
              <DialogTitle>Adicionar Nova Conta a Pagar</DialogTitle>
              <DialogDescription>Digite os detalhes da nova conta a pagar.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddPayable(new FormData(e.currentTarget))
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
                    <Label htmlFor="dueDate">Data de Vencimento</Label>
                    <Input id="dueDate" name="dueDate" type="date" required />
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
                        <SelectItem value="paid">Pago</SelectItem>
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

                <div className="flex items-center space-x-2">
                  <Switch id="reminder" name="reminder" />
                  <Label htmlFor="reminder">Definir lembrete para data de vencimento</Label>
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
              <DialogTitle>Editar Conta a Pagar</DialogTitle>
              <DialogDescription>Atualize os detalhes da conta a pagar.</DialogDescription>
            </DialogHeader>
            {currentPayable && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleEditPayable(new FormData(e.currentTarget))
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Descrição</Label>
                    <Input
                      id="edit-description"
                      name="description"
                      defaultValue={currentPayable.description}
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
                        defaultValue={currentPayable.amount}
                        placeholder="0,00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-dueDate">Data de Vencimento</Label>
                      <Input
                        id="edit-dueDate"
                        name="dueDate"
                        type="date"
                        defaultValue={currentPayable.dueDate}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Categoria</Label>
                      <Select name="category" defaultValue={currentPayable.categoryId}>
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
                      <Select name="status" defaultValue={currentPayable.status}>
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="paid">Pago</SelectItem>
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

                  <div className="flex items-center space-x-2">
                    <Switch id="edit-reminder" name="reminder" defaultChecked={currentPayable.reminder} />
                    <Label htmlFor="edit-reminder">Definir lembrete para data de vencimento</Label>
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
              <AlertDialogTitle>Excluir Conta a Pagar</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta conta a pagar? Esta ação não pode ser desfeita.
                {currentPayable?.recurrence && (
                  <div className="mt-2 font-medium text-destructive">
                    Atenção: Esta é uma conta recorrente. Todos os pagamentos futuros também serão excluídos.
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePayable} className="bg-destructive text-destructive-foreground">
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
                  <SelectItem value="paid">Pago</SelectItem>
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
            data={filteredPayables}
            onRowClick={openEditDialog}
          />
        </CardContent>
      </Card>
    </div>
  )
}
