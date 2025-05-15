"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useBankData } from "@/context/bank-data-context"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle2, Home, ArrowLeftRight } from "lucide-react"
import Link from "next/link"
import { TransactionSuccessSkeleton } from "@/components/skeleton-loader"

export default function TransferSuccessPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { getAccountById, isLoading: dataLoading } = useBankData()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [transactionDetails, setTransactionDetails] = useState<{
    fromAccountId: string
    toAccountNumber: string
    recipientName: string
    amount: number
    description: string
    date: string
  } | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // URL 파라미터에서 거래 정보 가져오기
    const fromAccountId = searchParams.get("fromAccountId")
    const toAccountNumber = searchParams.get("toAccountNumber")
    const recipientName = searchParams.get("recipientName")
    const amount = searchParams.get("amount")
    const description = searchParams.get("description")
    const date = searchParams.get("date")

    // 필수 정보가 없으면 송금 페이지로 리다이렉트
    if (!fromAccountId || !toAccountNumber || !amount) {
      router.push("/transfer")
      return
    }

    // 이미 상태가 설정되어 있으면 다시 설정하지 않음
    if (transactionDetails) return

    setTransactionDetails({
      fromAccountId,
      toAccountNumber,
      recipientName: recipientName || "수취인",
      amount: Number.parseFloat(amount),
      description: description || "",
      date: date || new Date().toISOString(),
    })
  }, [authLoading, isAuthenticated, router, searchParams, transactionDetails])

  if (authLoading || dataLoading || !transactionDetails) {
    return <TransactionSuccessSkeleton />
  }

  const fromAccount = getAccountById(transactionDetails.fromAccountId)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-300" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">송금 완료</h1>
            <p className="text-muted-foreground">송금이 성공적으로 완료되었습니다.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>송금 내역</CardTitle>
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
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">송금 금액</p>
                <p className="text-2xl font-bold">{formatCurrency(transactionDetails.amount, "KRW")}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">출금 계좌</p>
                <p className="font-medium">
                  {fromAccount ? `${fromAccount.accountName} (${fromAccount.accountNumber})` : "계좌 정보 없음"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">입금 계좌</p>
                <p className="font-medium">{transactionDetails.toAccountNumber}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">수취인</p>
                <p className="font-medium">{transactionDetails.recipientName}</p>
              </div>

              {transactionDetails.description && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">내용</p>
                  <p className="font-medium">{transactionDetails.description}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">수수료</p>
                <p className="font-medium">{formatCurrency(500, "KRW")}</p>
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
                <Link href="/transfer">
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  새로운 송금하기
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
