"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, FileUp, X } from "lucide-react"

// Sample data for bank statement entries
const bankStatementEntries = [
  { id: 1, date: "2023-04-01", description: "Depósito de Salário", amount: 3500, type: "credit", mapped: false },
  { id: 2, date: "2023-04-02", description: "Supermercado", amount: 120.45, type: "debit", mapped: false },
  {
    id: 3,
    date: "2023-04-05",
    description: "Conta de Internet",
    amount: 79.99,
    type: "debit",
    mapped: true,
    mappedTo: "payable",
  },
  {
    id: 4,
    date: "2023-04-10",
    description: "Pagamento de Cliente",
    amount: 1500,
    type: "credit",
    mapped: true,
    mappedTo: "receivable",
  },
  { id: 5, date: "2023-04-15", description: "Restaurante", amount: 85.2, type: "debit", mapped: false },
  { id: 6, date: "2023-04-20", description: "Posto de Gasolina", amount: 45.67, type: "debit", mapped: false },
  {
    id: 7,
    date: "2023-04-25",
    description: "Pagamento de Aluguel",
    amount: 2000,
    type: "debit",
    mapped: true,
    mappedTo: "payable",
  },
  {
    id: 8,
    date: "2023-04-28",
    description: "Renda Freelance",
    amount: 800,
    type: "credit",
    mapped: true,
    mappedTo: "receivable",
  },
]

export default function BankStatementPage() {
  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [entries, setEntries] = useState(bankStatementEntries)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would process the OFX file
    // For demo purposes, we'll just set the state
    if (e.target.files && e.target.files.length > 0) {
      setIsFileUploaded(true)
    }
  }

  const handleMapEntry = (id: number, mappedTo: string) => {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, mapped: true, mappedTo } : entry)))
  }

  const handleUnmapEntry = (id: number) => {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, mapped: false, mappedTo: undefined } : entry)))
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Importar Extrato Bancário</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Carregar Extrato Bancário</CardTitle>
          <CardDescription>Carregue seu extrato bancário no formato OFX para importar transações.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Arraste e solte seu arquivo aqui</h3>
            <p className="text-sm text-muted-foreground mb-4">Suporta arquivos .OFX da maioria dos bancos</p>
            <div className="flex items-center gap-4">
              <Button as="label" htmlFor="file-upload">
                <FileUp className="mr-2 h-4 w-4" />
                Procurar Arquivos
                <input id="file-upload" type="file" accept=".ofx" className="sr-only" onChange={handleFileUpload} />
              </Button>
              {isFileUploaded && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Arquivo carregado com sucesso
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isFileUploaded && (
        <Card>
          <CardHeader>
            <CardTitle>Mapear Transações</CardTitle>
            <CardDescription>
              Vincule as entradas do extrato bancário às suas contas a pagar e a receber.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.date).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className={entry.type === "credit" ? "text-green-500" : "text-red-500"}>
                      {entry.type === "credit" ? "+" : "-"}R$ {entry.amount.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.type === "credit" ? "success" : "destructive"}>
                        {entry.type === "credit" ? "Receita" : "Despesa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entry.mapped ? (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          Mapeado para {entry.mappedTo === "payable" ? "Conta a Pagar" : "Conta a Receber"}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Não mapeado</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.mapped ? (
                        <Button variant="ghost" size="sm" onClick={() => handleUnmapEntry(entry.id)}>
                          <X className="h-4 w-4 mr-1" /> Desvincular
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Select onValueChange={(value) => handleMapEntry(entry.id, value)}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Mapear para..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="payable">Conta a Pagar</SelectItem>
                              <SelectItem value="receivable">Conta a Receber</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
