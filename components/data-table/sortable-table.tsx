"use client"

import React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"

export type ColumnDef = {
  id: string
  header: string
  accessorKey: string
  cell?: (info: any) => React.ReactNode
  enableSorting?: boolean
}

type SortableTableProps = {
  columns: ColumnDef[]
  data: any[]
  onRowClick?: (row: any) => void
}

export function SortableTable({ columns, data, onRowClick }: SortableTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc"
    }

    setSortConfig({ key, direction })
  }

  // Sort data
  const sortedData = React.useMemo(() => {
    const sortableItems = [...data]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
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
    return sortableItems
  }, [data, sortConfig])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
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
        {sortedData.length > 0 ? (
          sortedData.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? "cursor-pointer hover:bg-accent/50" : ""}
            >
              {columns.map((column) => (
                <TableCell key={column.id}>{column.cell ? column.cell(row) : row[column.accessorKey]}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Nenhum registro encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
