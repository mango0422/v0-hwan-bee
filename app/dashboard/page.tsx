"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AccountCard } from "@/components/account-card"
import { TransactionList } from "@/components/transaction-list"
import { useAuth } from "@/context/auth-context"
import { useBankData } from "@/context/bank-data-context"
import { ArrowRight, Plus, PiggyBank, RefreshCw, ArrowLeftRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()
  const { accounts, transactions, isLoading: dataLoading } = useBankData()
  const router = useRouter()

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

  // 최근 거래 내역 (모든 계좌의 거래 내역을 합쳐서 최근 5개만 표시)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          {/* 환영 메시지 */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">안녕하세요, {user?.name || "고객"}님!</h1>
            <p className="text-muted-foreground mt-1">
              HwanBee 은행에 오신 것을 환영합니다. 오늘의 금융 현황을 확인하세요.
            </p>
          </div>

          {/* 계좌 요약 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">내 계좌</h2>
              <Link href="/accounts">
                <Button variant="ghost" size="sm" className="gap-1">
                  전체보기 <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {accounts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground mb-4">
                    아직 계좌가 없습니다. 새 계좌를 개설해보세요.
                  </p>
                  <Link href="/accounts/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> 계좌 개설하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
                <Link href="/accounts/new" className="block h-full">
                  <Card className="flex h-full items-center justify-center border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-center text-muted-foreground">새 계좌 개설</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )}
          </div>

          {/* 빠른 액션 */}
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/transfer">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <ArrowLeftRight className="mr-2 h-5 w-5 text-primary" />
                    송금하기
                  </CardTitle>
                  <CardDescription>다른 계좌로 송금하세요</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/exchange">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <RefreshCw className="mr-2 h-5 w-5 text-primary" />
                    환전하기
                  </CardTitle>
                  <CardDescription>외화로 환전하세요</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/accounts/new">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <PiggyBank className="mr-2 h-5 w-5 text-primary" />
                    계좌 개설
                  </CardTitle>
                  <CardDescription>새 계좌를 개설하세요</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* 최근 거래 내역 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">최근 거래 내역</h2>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/transactions">
                  전체보기 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                {recentTransactions.length > 0 ? (
                  <TransactionList transactions={recentTransactions} />
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">거래 내역이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
