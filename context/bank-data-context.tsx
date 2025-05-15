"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import {
  type Account,
  AccountType,
  type BankDataState,
  type ExchangeRate,
  type Transaction,
  TransactionType,
  TransactionStatus,
} from "@/types/bank"
import { useAuth } from "./auth-context"
// import { API } from "@/lib/api" // 실제 API 연동 시 주석 해제

interface BankDataContextType extends BankDataState {
  getAccounts: () => Account[]
  getAccountById: (id: string) => Account | undefined
  getTransactionsByAccountId: (accountId: string) => Transaction[]
  getTransactionById: (id: string) => Transaction | undefined
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
// TODO: [API 연동 시 삭제] 아래 더미 데이터는 실제 API 연동 시 삭제하세요.
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
  // 추가된 더미 계좌 데이터
  {
    id: "3",
    accountNumber: "123-456-789014",
    accountName: "여행 자금 계좌",
    balance: 3500000,
    currency: "KRW",
    type: AccountType.CHECKING,
    createdAt: "2023-03-10T11:20:00Z",
  },
  {
    id: "4",
    accountNumber: "123-456-789015",
    accountName: "비상금 계좌",
    balance: 2000000,
    currency: "KRW",
    type: AccountType.DEPOSIT,
    createdAt: "2023-04-05T16:45:00Z",
  },
]

// 샘플 거래 데이터
// TODO: [API 연동 시 삭제] 아래 더미 데이터는 실제 API 연동 시 삭제하세요.
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    accountId: "1",
    amount: 500000,
    type: TransactionType.DEPOSIT,
    description: "월급",
    date: "2023-05-25T09:00:00Z",
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-05-25T09:01:00Z",
  },
  {
    id: "2",
    accountId: "1",
    amount: -50000,
    type: TransactionType.WITHDRAWAL,
    description: "ATM 출금",
    date: "2023-05-26T15:30:00Z",
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-05-26T15:31:00Z",
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
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-05-27T11:46:00Z",
    fee: 500,
  },
  {
    id: "4",
    accountId: "2",
    amount: 100000,
    type: TransactionType.DEPOSIT,
    description: "적금 입금",
    date: "2023-05-20T10:15:00Z",
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-05-20T10:16:00Z",
  },
  {
    id: "5",
    accountId: "1",
    amount: -200000,
    type: TransactionType.EXCHANGE,
    description: "달러 환전",
    date: "2023-06-01T14:30:00Z",
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-06-01T14:32:00Z",
    exchangeRate: 1350.45,
    exchangedAmount: 148.1,
    fee: 1000,
  },
  // 추가된 더미 거래 데이터
  {
    id: "6",
    accountId: "3",
    amount: 1500000,
    type: TransactionType.DEPOSIT,
    description: "여행 자금 입금",
    date: "2023-06-05T09:30:00Z",
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-06-05T09:31:00Z",
  },
  {
    id: "7",
    accountId: "3",
    amount: -350000,
    type: TransactionType.WITHDRAWAL,
    description: "항공권 구매",
    date: "2023-06-10T13:45:00Z",
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-06-10T13:46:00Z",
  },
  {
    id: "8",
    accountId: "4",
    amount: 500000,
    type: TransactionType.DEPOSIT,
    description: "비상금 입금",
    date: "2023-06-15T11:20:00Z",
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-06-15T11:21:00Z",
  },
  {
    id: "9",
    accountId: "3",
    amount: -250000,
    type: TransactionType.EXCHANGE,
    description: "유로 환전",
    date: "2023-06-20T16:30:00Z",
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-06-20T16:31:00Z",
    exchangeRate: 1450.32,
    exchangedAmount: 172.38,
    fee: 1000,
  },
  {
    id: "10",
    accountId: "1",
    amount: -80000,
    type: TransactionType.TRANSFER,
    description: "공과금 납부",
    recipientName: "한국전력공사",
    recipientAccount: "111-222-333444",
    date: "2023-06-25T10:00:00Z",
    status: TransactionStatus.COMPLETED,
    processingTime: "2023-06-25T10:01:00Z",
    fee: 0,
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

  // 초기화 여부를 추적하는 ref
  const initialized = useRef(false)

  useEffect(() => {
    // 이미 초기화되었으면 중복 실행 방지
    if (initialized.current) return

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

      // 초기화 완료 표시
      initialized.current = true
    } else {
      setBankData((prev) => ({
        ...prev,
        isLoading: false,
      }))
    }

    // TODO: [API 연동 시 수정]
    // 실제 API 연동 시 아래 코드로 대체
    /*
    if (isAuthenticated) {
      // 병렬로 데이터 가져오기
      Promise.all([API.accounts.getAll(), API.transactions.getAll(), API.exchange.getRates()])
        .then(([accountsResponse, transactionsResponse, ratesResponse]) => {
          setBankData({
            accounts: accountsResponse.data,
            transactions: transactionsResponse.data,
            exchangeRates: ratesResponse.data,
            isLoading: false,
          })
          
          // 초기화 완료 표시
          initialized.current = true
        })
        .catch((error) => {
          console.error("Error fetching bank data:", error)
          setBankData({
            ...bankData,
            isLoading: false,
          })
        })
    } else {
      setBankData({
        ...bankData,
        isLoading: false,
      })
    }
    */
  }, [isAuthenticated]) // bankData 의존성 제거

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

  // 거래 ID로 거래 상세 정보 가져오기
  const getTransactionById = (id: string) => {
    return bankData.transactions.find((transaction) => transaction.id === id)
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

    setBankData((prev) => ({
      ...prev,
      accounts: updatedAccounts,
    }))

    return newAccount

    // TODO: [API 연동 시 수정]
    // 실제 API 연동 시 아래 코드로 대체
    /*
    try {
      const response = await API.accounts.create(accountData)

      // 계좌 목록 갱신
      const accountsResponse = await API.accounts.getAll()
      setBankData((prev) => ({
        ...prev,
        accounts: accountsResponse.data,
      }))

      return response.data
    } catch (error) {
      console.error("Error creating account:", error)
      throw error
    }
    */
  }

  // 새 거래 생성
  const createTransaction = async (transactionData: Omit<Transaction, "id" | "date">): Promise<Transaction> => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      status: TransactionStatus.COMPLETED,
      processingTime: new Date().toISOString(),
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

    setBankData((prev) => ({
      ...prev,
      accounts: updatedAccounts,
      transactions: updatedTransactions,
    }))

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
      recipientName: "수취인",
      status: TransactionStatus.COMPLETED,
      fee: 500,
    })

    return true

    // TODO: [API 연동 시 수정]
    // 실제 API 연동 시 아래 코드로 대체
    /*
    try {
      await API.transactions.transfer({
        fromAccountId,
        toAccountNumber,
        amount,
        description,
      })

      // 계좌 및 거래 내역 갱신
      const [accountsResponse, transactionsResponse] = await Promise.all([
        API.accounts.getAll(),
        API.transactions.getAll(),
      ])

      setBankData((prev) => ({
        ...prev,
        accounts: accountsResponse.data,
        transactions: transactionsResponse.data,
      }))

      return true
    } catch (error) {
      console.error("Error transferring money:", error)
      return false
    }
    */
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
      status: TransactionStatus.COMPLETED,
      exchangeRate: exchangeRate.rate,
      exchangedAmount: amount / exchangeRate.rate,
      fee: 1000,
    })

    return true

    // TODO: [API 연동 시 수정]
    // 실제 API 연동 시 아래 코드로 대체
    /*
    try {
      await API.transactions.exchange({
        fromAccountId,
        toCurrency,
        amount,
      })

      // 계좌 및 거래 내역 갱신
      const [accountsResponse, transactionsResponse] = await Promise.all([
        API.accounts.getAll(),
        API.transactions.getAll(),
      ])

      setBankData((prev) => ({
        ...prev,
        accounts: accountsResponse.data,
        transactions: transactionsResponse.data,
      }))

      return true
    } catch (error) {
      console.error("Error exchanging currency:", error)
      return false
    }
    */
  }

  return (
    <BankDataContext.Provider
      value={{
        ...bankData,
        getAccounts,
        getAccountById,
        getTransactionsByAccountId,
        getTransactionById,
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
