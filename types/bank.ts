export interface Account {
  id: string
  accountNumber: string
  accountName: string
  balance: number
  currency: string
  type: AccountType
  createdAt: string
}

export enum AccountType {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  DEPOSIT = "DEPOSIT",
}

export interface Transaction {
  id: string
  accountId: string
  amount: number
  type: TransactionType
  description: string
  recipientName?: string
  recipientAccount?: string
  date: string
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
  EXCHANGE = "EXCHANGE",
}

export interface ExchangeRate {
  currency: string
  rate: number
  name: string
  flag: string
}

export interface BankDataState {
  accounts: Account[]
  transactions: Transaction[]
  exchangeRates: ExchangeRate[]
  isLoading: boolean
}
