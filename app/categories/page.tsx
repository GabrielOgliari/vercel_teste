"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
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
import { DataTable, type ColumnDef } from "@/components/data-table/data-table"

// Tipos
type Category = {
  id: string
  name: string
  description: string
  type: "income" | "expense"
  color: string
  count: number
}

// Dados de exemplo
const initialCategories: Category[] = [
  {
    id: "1",
    name: "Moradia",
    description: "Despesas relacionadas à moradia, como aluguel e condomínio",
    type: "expense",
    color: "#3b82f6",
    count: 12,
  },
  {
    id: "2",
    name: "Alimentação",
    description: "Despesas com alimentação, como supermercado e restaurantes",
    type: "expense",
    color: "#10b981",
    count: 8,
  },
  {
    id: "3",
    name: "Transporte",
    description: "Despesas com transporte, como combustível e transporte público",
    type: "expense",
    color: "#f59e0b",
    count: 5,
  },
  {
    id: "4",
    name: "Lazer",
    description: "Despesas com lazer, como cinema e viagens",
    type: "expense",
    color: "#ef4444",
    count: 3,
  },
  {
    id: "5",
    name: "Saúde",
    description: "Despesas com saúde, como plano de saúde e medicamentos",
    type: "expense",
    color: "#8b5cf6",
    count: 2,
  },
  {
    id: "6",
    name: "Salário",
    description: "Receitas de salário",
    type: "income",
    color: "#22c55e",
    count: 1,
  },
  {
    id: "7",
    name: "Freelance",
    description: "Receitas de trabalhos freelance",
    type: "income",
    color: "#06b6d4",
    count: 3,
  },
  {
    id: "8",
    name: "Investimentos",
    description: "Receitas de investimentos",
    type: "income",
    color: "#eab308",
    count: 4,
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
    type: "expense",
    color: "#3b82f6",
  })

  // Definição das colunas
  const columns: ColumnDef[] = [
    {
      id: "name",
      header: "Nome",
      accessorKey: "name",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: info.color }} />
          <span className="font-medium">{info.name}</span>
        </div>
      ),
    },
    {
      id: "description",
      header: "Descrição",
      accessorKey: "description",
    },
    {
      id: "type",
      header: "Tipo",
      accessorKey: "type",
      cell: (info) => (
        <Badge variant={info.type === "income" ? "success" : "destructive"}>
          {info.type === "income" ? "Receita" : "Despesa"}
        </Badge>
      ),
    },
    {
      id: "count",
      header: "Uso",
      accessorKey: "count",
      cell: (info) => (
        <Badge variant="outline">
          {info.count} {info.count === 1 ? "item" : "itens"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      accessorKey: "id",
      enableSorting: false,
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(info)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(info)
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  // Funções de manipulação
  const handleAdd = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const category: Category = {
      id,
      name: newCategory.name || "",
      description: newCategory.description || "",
      type: newCategory.type as "income" | "expense",
      color: newCategory.color || "#3b82f6",
      count: 0,
    }

    setCategories([...categories, category])
    setIsAddDialogOpen(false)
    setNewCategory({
      name: "",
      description: "",
      type: "expense",
      color: "#3b82f6",
    })

    toast({
      title: "Categoria adicionada",
      description: `A categoria ${category.name} foi adicionada com sucesso.`,
    })
  }

  const handleEdit = (category: Category) => {
    setCurrentCategory(category)
    setNewCategory({
      name: category.name,
      description: category.description,
      type: category.type,
      color: category.color,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!currentCategory) return

    const updatedCategories = categories.map((cat) =>
      cat.id === currentCategory.id
        ? {
            ...cat,
            name: newCategory.name || cat.name,
            description: newCategory.description || cat.description,
            type: (newCategory.type as "income" | "expense") || cat.type,
            color: newCategory.color || cat.color,
          }
        : cat,
    )

    setCategories(updatedCategories)
    setIsEditDialogOpen(false)
    setCurrentCategory(null)

    toast({
      title: "Categoria atualizada",
      description: `A categoria ${newCategory.name} foi atualizada com sucesso.`,
    })
  }

  const handleDelete = (category: Category) => {
    setCurrentCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!currentCategory) return

    const updatedCategories = categories.filter((cat) => cat.id !== currentCategory.id)
    setCategories(updatedCategories)
    setIsDeleteDialogOpen(false)
    setCurrentCategory(null)

    toast({
      title: "Categoria excluída",
      description: `A categoria ${currentCategory.name} foi excluída com sucesso.`,
    })
  }

  const handleRowClick = (category: Category) => {
    handleEdit(category)
  }

  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Gerenciamento de Categorias</h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>Preencha os campos abaixo para adicionar uma nova categoria.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Nome da categoria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Descrição da categoria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="expense"
                      name="type"
                      value="expense"
                      checked={newCategory.type === "expense"}
                      onChange={() => setNewCategory({ ...newCategory, type: "expense" })}
                      className="mr-2"
                    />
                    <Label htmlFor="expense">Despesa</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="income"
                      name="type"
                      value="income"
                      checked={newCategory.type === "income"}
                      onChange={() => setNewCategory({ ...newCategory, type: "income" })}
                      className="mr-2"
                    />
                    <Label htmlFor="income">Receita</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd} disabled={!newCategory.name}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categories}
            searchPlaceholder="Buscar categorias..."
            onRowClick={handleRowClick}
            exportFileName="categorias"
          />
        </CardContent>
      </Card>

      {/* Diálogo de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>Atualize os campos abaixo para editar a categoria.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Nome da categoria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Descrição da categoria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Tipo</Label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="edit-expense"
                    name="edit-type"
                    value="expense"
                    checked={newCategory.type === "expense"}
                    onChange={() => setNewCategory({ ...newCategory, type: "expense" })}
                    className="mr-2"
                  />
                  <Label htmlFor="edit-expense">Despesa</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="edit-income"
                    name="edit-type"
                    value="income"
                    checked={newCategory.type === "income"}
                    onChange={() => setNewCategory({ ...newCategory, type: "income" })}
                    className="mr-2"
                  />
                  <Label htmlFor="edit-income">Receita</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Cor</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="edit-color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={!newCategory.name}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{currentCategory?.name}"?
              {currentCategory && currentCategory.count > 0 && (
                <div className="mt-2 text-destructive">
                  Esta categoria está sendo usada em {currentCategory.count}{" "}
                  {currentCategory.count === 1 ? "item" : "itens"}. Excluí-la pode afetar esses registros.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
