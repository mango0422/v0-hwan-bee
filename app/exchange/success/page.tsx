"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useBankData } from "@/context/bank-data-context"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle2, Home, RefreshCw, ArrowRight } from "lucide-react"
import Link from "next/link"
import { TransactionSuccessSkeleton } from "@/components/skeleton-loader"

export default function ExchangeSuccessPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { getAccountById, exchangeRates, isLoading: dataLoading } = useBankData()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [transactionDetails, setTransactionDetails] = useState<{
    fromAccountId: string
    toCurrency: string
    amount: number
    exchangedAmount: number
    date: string
  } | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // URL 파라미터에서 거래 정보 가져오기
    const fromAccountId = searchParams.get("fromAccountId")
    const toCurrency = searchParams.get("toCurrency")
    const amount = searchParams.get("amount")
    const exchangedAmount = searchParams.get("exchangedAmount")
    const date = searchParams.get("date")

    // 필수 정보가 없으면 환전 페이지로 리다이렉트
    if (!fromAccountId || !toCurrency || !amount || !exchangedAmount) {
      router.push("/exchange")
      return
    }

    // 이미 상태가 설정되어 있으면 다시 설정하지 않음
    if (transactionDetails) return

    setTransactionDetails({
      fromAccountId,
      toCurrency,
      amount: Number.parseFloat(amount),
      exchangedAmount: Number.parseFloat(exchangedAmount),
      date: date || new Date().toISOString(),
    })
  }, [authLoading, isAuthenticated, router, searchParams, transactionDetails])

  if (authLoading || dataLoading || !transactionDetails) {
    return <TransactionSuccessSkeleton />
  }

  const fromAccount = getAccountById(transactionDetails.fromAccountId)
  const exchangeRate = exchangeRates.find((rate) => rate.currency === transactionDetails.toCurrency)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-300" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">환전 완료</h1>
            <p className="text-muted-foreground">환전이 성공적으로 완료되었습니다.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>환전 내역</CardTitle>
              <CardDescription>
                {new Date(transactionDetails.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">환전 금액</p>
                  <p className="text-xl font-bold">{formatCurrency(transactionDetails.amount, "KRW")}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1 text-right">
                  <p className="text-sm text-muted-foreground">수령 금액</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(transactionDetails.exchangedAmount, transactionDetails.toCurrency)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">출금 계좌</p>
                <p className="font-medium">
                  {fromAccount ? `${fromAccount.accountName} (${fromAccount.accountNumber})` : "계좌 정보 없음"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">환전 통화</p>
                <p className="font-medium">
                  {exchangeRate
                    ? `${exchangeRate.flag} ${exchangeRate.name} (${exchangeRate.currency})`
                    : transactionDetails.toCurrency}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">적용 환율</p>
                <p className="font-medium">
                  1 {transactionDetails.toCurrency} = {formatCurrency(exchangeRate?.rate || 0, "KRW")}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">수수료</p>
                <p className="font-medium">{formatCurrency(1000, "KRW")}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  대시보드로 이동
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/exchange">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  새로운 환전하기
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
