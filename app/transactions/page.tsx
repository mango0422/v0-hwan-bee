"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionList } from "@/components/transaction-list"
import { useAuth } from "@/context/auth-context"
import { useBankData } from "@/context/bank-data-context"
import { Label } from "@/components/ui/label"

export default function TransactionsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { accounts, transactions, isLoading: dataLoading } = useBankData()
  const router = useRouter()

  const [selectedAccountId, setSelectedAccountId] = useState<string | "all">("all")
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (selectedAccountId === "all") {
      setFilteredTransactions([...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } else {
      setFilteredTransactions(
        transactions
          .filter((transaction) => transaction.accountId === selectedAccountId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      )
    }
  }, [selectedAccountId, transactions])

  if (authLoading || dataLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="flex items-center justify-center h-full">
            <p>로딩 중...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">거래 내역</h1>
            <p className="text-muted-foreground mt-1">모든 계좌의 거래 내역을 확인하세요.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountFilter">계좌 선택</Label>
            <Select value={selectedAccountId} onValueChange={(value) => setSelectedAccountId(value)}>
              <SelectTrigger id="accountFilter" className="w-full md:w-[300px]">
                <SelectValue placeholder="계좌 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 계좌</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountName} ({account.accountNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedAccountId === "all"
                  ? "전체 거래 내역"
                  : `${accounts.find((a) => a.id === selectedAccountId)?.accountName || ""} 거래 내역`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={filteredTransactions} showAccountInfo={selectedAccountId === "all"} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
