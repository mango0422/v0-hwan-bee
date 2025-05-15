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
import { TransactionType } from "@/types/bank"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, RefreshCw, ArrowLeftRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransactionsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { accounts, transactions, isLoading: dataLoading } = useBankData()
  const router = useRouter()

  const [selectedAccountId, setSelectedAccountId] = useState<string | "all">("all")
  const [selectedType, setSelectedType] = useState<string | "all">("all")
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    let filtered = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // 계좌 필터링
    if (selectedAccountId !== "all") {
      filtered = filtered.filter((transaction) => transaction.accountId === selectedAccountId)
    }

    // 거래 유형 필터링
    if (selectedType !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === selectedType)
    }

    setFilteredTransactions(filtered)
  }, [selectedAccountId, selectedType, transactions])

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

          <div className="space-y-6">
            {/* 계좌 필터 */}
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

            {/* 거래 유형 필터 - 항상 표시 */}
            <div className="space-y-2">
              <Label>거래 유형</Label>
              <Tabs defaultValue={selectedType} onValueChange={setSelectedType} className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value={TransactionType.DEPOSIT} className="flex items-center gap-1">
                    <ArrowDownLeft className="h-3 w-3 text-green-500" />
                    입금
                  </TabsTrigger>
                  <TabsTrigger value={TransactionType.WITHDRAWAL} className="flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3 text-red-500" />
                    출금
                  </TabsTrigger>
                  <TabsTrigger value={TransactionType.TRANSFER} className="flex items-center gap-1">
                    <ArrowLeftRight className="h-3 w-3 text-blue-500" />
                    송금
                  </TabsTrigger>
                  <TabsTrigger value={TransactionType.EXCHANGE} className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 text-orange-500" />
                    환전
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedAccountId === "all"
                  ? "전체 거래 내역"
                  : `${accounts.find((a) => a.id === selectedAccountId)?.accountName || ""} 거래 내역`}
              </CardTitle>
              {selectedType !== "all" && (
                <Badge className="ml-2">
                  {selectedType === TransactionType.DEPOSIT && "입금"}
                  {selectedType === TransactionType.WITHDRAWAL && "출금"}
                  {selectedType === TransactionType.TRANSFER && "송금"}
                  {selectedType === TransactionType.EXCHANGE && "환전"}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <TransactionList transactions={filteredTransactions} showAccountInfo={selectedAccountId === "all"} />
              {filteredTransactions.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">조건에 맞는 거래 내역이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
