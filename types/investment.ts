// Define common types for investments

export type FixedIncomeInvestment = {
  id: number
  name: string
  amount: number
  rate: number
  startDate: string
  endDate: string
  type: "fixed"
}

export type VariableIncomeInvestment = {
  id: number
  name: string
  amount: number
  shares: number
  currentPrice: number
  purchasePrice: number
  change: number
  type: "variable"
}

export type CryptoInvestment = {
  id: number
  name: string
  amount: number
  quantity: number
  currentPrice: number
  purchasePrice: number
  change: number
  type: "crypto"
}

export type Dividend = {
  id: number
  investmentName: string
  amount: number
  date: string
  type: string
}

export type Investment = FixedIncomeInvestment | VariableIncomeInvestment | CryptoInvestment
