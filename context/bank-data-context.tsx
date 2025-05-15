"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type Account,
  AccountType,
  type BankDataState,
  type ExchangeRate,
  type Transaction,
  TransactionType,
} from "@/types/bank"
import { useAuth } from "./auth-context"

interface BankDataContextType extends BankDataState {
  getAccounts: () => Account[]
  getAccountById: (id: string) => Account | undefined
  getTransactionsByAccountId: (accountId: string) => Transaction[]
  createAccount: (account: Omit<Account, "id" | "createdAt">) => Promise<Account>
  createTransaction: (transaction: Omit<Transaction, "id" | "date">) => Promise<Transaction>
  transferMoney: (
    fromAccountId: string,
    toAccountNumber: string,
    amount: number,
    description: string,
  ) => Promise<boolean>
  exchangeCurrency: (fromAccountId: string, toCurrency: string, amount: number) => Promise<boolean>
}

const BankDataContext = createContext<BankDataContextType | undefined>(undefined)

// 샘플 환율 데이터
const SAMPLE_EXCHANGE_RATES: ExchangeRate[] = [
  { currency: "USD", rate: 1350.45, name: "미국 달러", flag: "🇺🇸" },
  { currency: "EUR", rate: 1450.32, name: "유로", flag: "🇪🇺" },
  { currency: "JPY", rate: 9.12, name: "일본 엔", flag: "🇯🇵" },
  { currency: "CNY", rate: 186.75, name: "중국 위안", flag: "🇨🇳" },
  { currency: "GBP", rate: 1720.5, name: "영국 파운드", flag: "🇬🇧" },
]

// 샘플 계좌 데이터
const SAMPLE_ACCOUNTS: Account[] = [
  {
    id: "1",
    accountNumber: "123-456-789012",
    accountName: "일반 입출금 계좌",
    balance: 1250000,
    currency: "KRW",
    type: AccountType.CHECKING,
    createdAt: "2023-01-15T09:30:00Z",
  },
  {
    id: "2",
    accountNumber: "123-456-789013",
    accountName: "적금 계좌",
    balance: 5000000,
    currency: "KRW",
    type: AccountType.SAVINGS,
    createdAt: "2023-02-20T14:15:00Z",
  },
]

// 샘플 거래 데이터
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    accountId: "1",
    amount: 500000,
    type: TransactionType.DEPOSIT,
    description: "월급",
    date: "2023-05-25T09:00:00Z",
  },
  {
    id: "2",
    accountId: "1",
    amount: -50000,
    type: TransactionType.WITHDRAWAL,
    description: "ATM 출금",
    date: "2023-05-26T15:30:00Z",
  },
  {
    id: "3",
    accountId: "1",
    amount: -120000,
    type: TransactionType.TRANSFER,
    description: "친구에게 송금",
    recipientName: "홍길동",
    recipientAccount: "987-654-321098",
    date: "2023-05-27T11:45:00Z",
  },
  {
    id: "4",
    accountId: "2",
    amount: 100000,
    type: TransactionType.DEPOSIT,
    description: "적금 입금",
    date: "2023-05-20T10:15:00Z",
  },
]

export function BankDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [bankData, setBankData] = useState<BankDataState>({
    accounts: [],
    transactions: [],
    exchangeRates: SAMPLE_EXCHANGE_RATES,
    isLoading: true,
  })

  useEffect(() => {
    if (isAuthenticated) {
      // 로컬 스토리지에서 데이터 가져오기
      const storedAccounts = localStorage.getItem("accounts")
      const storedTransactions = localStorage.getItem("transactions")

      const accounts = storedAccounts ? JSON.parse(storedAccounts) : SAMPLE_ACCOUNTS
      const transactions = storedTransactions ? JSON.parse(storedTransactions) : SAMPLE_TRANSACTIONS

      setBankData({
        accounts,
        transactions,
        exchangeRates: SAMPLE_EXCHANGE_RATES,
        isLoading: false,
      })
    } else {
      setBankData({
        ...bankData,
        isLoading: false,
      })
    }
  }, [isAuthenticated])

  // 계좌 목록 가져오기
  const getAccounts = () => {
    return bankData.accounts
  }

  // 계좌 ID로 계좌 정보 가져오기
  const getAccountById = (id: string) => {
    return bankData.accounts.find((account) => account.id === id)
  }

  // 계좌 ID로 거래 내역 가져오기
  const getTransactionsByAccountId = (accountId: string) => {
    return bankData.transactions
      .filter((transaction) => transaction.accountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // 새 계좌 생성
  const createAccount = async (accountData: Omit<Account, "id" | "createdAt">): Promise<Account> => {
    const newAccount: Account = {
      ...accountData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    }

    const updatedAccounts = [...bankData.accounts, newAccount]
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts))

    setBankData({
      ...bankData,
      accounts: updatedAccounts,
    })

    return newAccount
  }

  // 새 거래 생성
  const createTransaction = async (transactionData: Omit<Transaction, "id" | "date">): Promise<Transaction> => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
    }

    // 계좌 잔액 업데이트
    const updatedAccounts = bankData.accounts.map((account) => {
      if (account.id === transactionData.accountId) {
        return {
          ...account,
          balance: account.balance + transactionData.amount,
        }
      }
      return account
    })

    const updatedTransactions = [...bankData.transactions, newTransaction]

    localStorage.setItem("accounts", JSON.stringify(updatedAccounts))
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions))

    setBankData({
      ...bankData,
      accounts: updatedAccounts,
      transactions: updatedTransactions,
    })

    return newTransaction
  }

  // 송금 기능
  const transferMoney = async (
    fromAccountId: string,
    toAccountNumber: string,
    amount: number,
    description: string,
  ): Promise<boolean> => {
    if (amount <= 0) return false

    const fromAccount = getAccountById(fromAccountId)
    if (!fromAccount || fromAccount.balance < amount) return false

    // 출금 거래 생성
    await createTransaction({
      accountId: fromAccountId,
      amount: -amount,
      type: TransactionType.TRANSFER,
      description,
      recipientAccount: toAccountNumber,
    })

    return true
  }

  // 환전 기능
  const exchangeCurrency = async (fromAccountId: string, toCurrency: string, amount: number): Promise<boolean> => {
    if (amount <= 0) return false

    const fromAccount = getAccountById(fromAccountId)
    if (!fromAccount || fromAccount.balance < amount) return false

    const exchangeRate = bankData.exchangeRates.find((rate) => rate.currency === toCurrency)
    if (!exchangeRate) return false

    // 환전 거래 생성
    await createTransaction({
      accountId: fromAccountId,
      amount: -amount,
      type: TransactionType.EXCHANGE,
      description: `${amount} ${fromAccount.currency}를 ${toCurrency}로 환전`,
    })

    return true
  }

  return (
    <BankDataContext.Provider
      value={{
        ...bankData,
        getAccounts,
        getAccountById,
        getTransactionsByAccountId,
        createAccount,
        createTransaction,
        transferMoney,
        exchangeCurrency,
      }}
    >
      {children}
    </BankDataContext.Provider>
  )
}

export function useBankData() {
  const context = useContext(BankDataContext)
  if (context === undefined) {
    throw new Error("useBankData must be used within a BankDataProvider")
  }
  return context
}
