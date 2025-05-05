"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ChevronsUpDown, Filter, Download, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export type ColumnDef = {
  id: string
  header: string
  accessorKey: string
  cell?: (info: any) => React.ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
}

type DataTableProps = {
  columns: ColumnDef[]
  data: any[]
  searchPlaceholder?: string
  onRowClick?: (row: any) => void
  pagination?: boolean
  pageSize?: number
  exportable?: boolean
  exportFileName?: string
}

export function DataTable({
  columns,
  data,
  searchPlaceholder = "Buscar...",
  onRowClick,
  pagination = true,
  pageSize = 10,
  exportable = true,
  exportFileName = "exported-data",
}: DataTableProps) {
  const [tableData, setTableData] = useState(data)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map((col) => col.id))

  // Aplicar ordenação
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc"
    }

    setSortConfig({ key, direction })
  }

  // Aplicar filtros e ordenação aos dados
  useEffect(() => {
    let filteredData = [...data]

    // Aplicar busca global
    if (searchTerm) {
      filteredData = filteredData.filter((item) => {
        return columns.some((column) => {
          const value = item[column.accessorKey]
          if (value == null) return false
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      })
    }

    // Aplicar filtros específicos
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter((item) => {
          const itemValue = item[key]
          if (typeof value === "string") {
            return String(itemValue).toLowerCase().includes(value.toLowerCase())
          }
          return itemValue === value
        })
      }
    })

    // Aplicar ordenação
    if (sortConfig) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1
        if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        return sortConfig.direction === "asc" ? (aValue > bValue ? 1 : -1) : aValue > bValue ? -1 : 1
      })
    }

    setTableData(filteredData)
  }, [data, searchTerm, sortConfig, filters])

  // Atualizar filtros ativos
  useEffect(() => {
    const active = Object.entries(filters)
      .filter(([_, value]) => value !== "")
      .map(([key, _]) => key)

    setActiveFilters(active)
  }, [filters])

  // Exportar dados para CSV
  const exportToCSV = () => {
    const visibleData = tableData.map((row) => {
      const newRow: Record<string, any> = {}
      columns
        .filter((col) => visibleColumns.includes(col.id))
        .forEach((col) => {
          newRow[col.header] = row[col.accessorKey]
        })
      return newRow
    })

    const headers = columns.filter((col) => visibleColumns.includes(col.id)).map((col) => col.header)

    const csvContent = [
      headers.join(","),
      ...visibleData.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Escapar vírgulas e aspas
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${exportFileName}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSearchTerm("")
    setFilters({})
    setSortConfig(null)
  }

  // Remover um filtro específico
  const removeFilter = (key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  // Calcular paginação
  const totalPages = pagination ? Math.ceil(tableData.length / pageSize) : 1
  const paginatedData = pagination ? tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : tableData

  // Alternar visibilidade das colunas
  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2">
          {/* Filtros avançados */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros avançados</SheetTitle>
                <SheetDescription>Configure os filtros para refinar os resultados</SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <ScrollArea className="h-[70vh] pr-4">
                  <div className="space-y-6">
                    {columns
                      .filter((col) => col.enableFiltering !== false)
                      .map((column) => (
                        <div key={column.id} className="space-y-2">
                          <Label htmlFor={`filter-${column.id}`}>{column.header}</Label>
                          <Input
                            id={`filter-${column.id}`}
                            placeholder={`Filtrar por ${column.header.toLowerCase()}`}
                            value={filters[column.accessorKey] || ""}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                [column.accessorKey]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}

                    <div className="space-y-2">
                      <Label>Colunas visíveis</Label>
                      <div className="space-y-2">
                        {columns.map((column) => (
                          <div key={column.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`column-${column.id}`}
                              checked={visibleColumns.includes(column.id)}
                              onCheckedChange={() => toggleColumnVisibility(column.id)}
                            />
                            <label
                              htmlFor={`column-${column.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {column.header}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Limpar filtros
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button>Aplicar filtros</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Exportar */}
          {exportable && (
            <Button variant="outline" size="sm" className="h-9" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros ativos */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((key) => {
            const column = columns.find((col) => col.accessorKey === key)
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {column?.header}: {filters[key]}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeFilter(key)}
                >
                  ×
                </Button>
              </Badge>
            )
          })}
          <Button variant="ghost" size="sm" className="h-7" onClick={clearAllFilters}>
            Limpar todos
          </Button>
        </div>
      )}

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((column) => visibleColumns.includes(column.id))
                .map((column) => (
                  <TableHead key={column.id}>
                    {column.enableSorting !== false ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                        onClick={() => handleSort(column.accessorKey)}
                      >
                        {column.header}
                        {sortConfig?.key === column.accessorKey ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-2 h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? "cursor-pointer hover:bg-accent/50" : ""}
                >
                  {columns
                    .filter((column) => visibleColumns.includes(column.id))
                    .map((column) => (
                      <TableCell key={column.id}>{column.cell ? column.cell(row) : row[column.accessorKey]}</TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * pageSize + 1} a {Math.min(currentPage * pageSize, tableData.length)} de{" "}
            {tableData.length} registros
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1

                // Ajustar para mostrar páginas ao redor da atual quando há muitas páginas
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
