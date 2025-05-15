"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionList } from "@/components/transaction-list"
import { useAuth } from "@/context/auth-context"
import { useBankData } from "@/context/bank-data-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeftRight, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { getAccountById, getTransactionsByAccountId, isLoading: dataLoading } = useBankData()
  const router = useRouter()
  const params = useParams()
  const accountId = params.id as string

  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

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

  const account = getAccountById(accountId)
  const transactions = getTransactionsByAccountId(accountId)

  if (!account) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild className="mr-4">
                <Link href="/accounts">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">계좌를 찾을 수 없습니다</h1>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-muted-foreground mb-4">요청하신 계좌 정보를 찾을 수 없습니다.</p>
                <Link href="/accounts">
                  <Button>계좌 목록으로 돌아가기</Button>
                </Link>
              </CardContent>
            </Card>
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
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-4">
              <Link href="/accounts">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{account.accountName}</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>계좌 정보</CardTitle>
              <CardDescription>{account.accountNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">잔액</p>
                  <p className="text-3xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">계좌 종류</p>
                    <p className="font-medium">
                      {account.type === "CHECKING" && "입출금 계좌"}
                      {account.type === "SAVINGS" && "적금 계좌"}
                      {account.type === "DEPOSIT" && "예금 계좌"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">개설일</p>
                    <p className="font-medium">{formatDate(account.createdAt)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-4">
                  <Link href={`/transfer?from=${account.id}`}>
                    <Button className="flex items-center">
                      <ArrowLeftRight className="mr-2 h-4 w-4" />
                      송금하기
                    </Button>
                  </Link>
                  <Link href={`/exchange?from=${account.id}`}>
                    <Button variant="outline" className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      환전하기
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions">거래 내역</TabsTrigger>
              <TabsTrigger value="details">상세 정보</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>거래 내역</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionList transactions={transactions} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>계좌 상세 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">계좌번호</p>
                        <p className="font-medium">{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">통화</p>
                        <p className="font-medium">{account.currency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">계좌 상태</p>
                        <p className="font-medium">정상</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">최근 거래일</p>
                        <p className="font-medium">
                          {transactions.length > 0 ? formatDate(transactions[0].date) : "거래 내역 없음"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
