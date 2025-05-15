"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useBankData } from "@/context/bank-data-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  ArrowLeftRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { TransactionStatus } from "@/types/bank"

export default function TransactionDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { getTransactionById, getAccountById, isLoading: dataLoading } = useBankData()
  const router = useRouter()
  const params = useParams()
  const transactionId = params.id as string

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

  const transaction = getTransactionById(transactionId)

  if (!transaction) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild className="mr-4">
                <Link href="/transactions">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">거래내역을 찾을 수 없습니다</h1>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-muted-foreground mb-4">요청하신 거래내역을 찾을 수 없습니다.</p>
                <Link href="/transactions">
                  <Button>거래내역 목록으로 돌아가기</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const account = getAccountById(transaction.accountId)

  // 거래 유형에 따른 아이콘 및 색상
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return <ArrowDownLeft className="h-6 w-6 text-green-500" />
      case "WITHDRAWAL":
        return <ArrowUpRight className="h-6 w-6 text-red-500" />
      case "TRANSFER":
        return <ArrowLeftRight className="h-6 w-6 text-blue-500" />
      case "EXCHANGE":
        return <RefreshCw className="h-6 w-6 text-orange-500" />
    }
  }

  // 거래 상태에 따른 아이콘 및 색상
  const getStatusIcon = () => {
    switch (transaction.status) {
      case TransactionStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case TransactionStatus.PENDING:
        return <Clock className="h-5 w-5 text-yellow-500" />
      case TransactionStatus.FAILED:
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  // 거래 유형에 따른 한글 설명
  const getTransactionTypeText = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return "입금"
      case "WITHDRAWAL":
        return "출금"
      case "TRANSFER":
        return "송금"
      case "EXCHANGE":
        return "환전"
    }
  }

  // 거래 상태에 따른 한글 설명
  const getStatusText = () => {
    switch (transaction.status) {
      case TransactionStatus.COMPLETED:
        return "완료"
      case TransactionStatus.PENDING:
        return "처리 중"
      case TransactionStatus.FAILED:
        return "실패"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-4">
              <Link href="/transactions">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">거래 상세 내역</h1>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{getTransactionTypeText()}</CardTitle>
                <CardDescription>{formatDate(transaction.date)}</CardDescription>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                {getTransactionIcon()}
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* 금액 정보 */}
              <div className="rounded-lg bg-muted p-6 text-center">
                <p className="text-sm text-muted-foreground">금액</p>
                <p className={`text-3xl font-bold ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                  {formatCurrency(transaction.amount, "KRW")}
                </p>
                {transaction.type === "EXCHANGE" && transaction.exchangedAmount && (
                  <p className="mt-2 text-muted-foreground">
                    환전: {formatCurrency(transaction.exchangedAmount, "USD")}
                  </p>
                )}
              </div>

              {/* 거래 상태 */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="font-medium">거래 상태</div>
                <div className="flex items-center">
                  {getStatusIcon()}
                  <span className="ml-2">{getStatusText()}</span>
                </div>
              </div>

              {/* 거래 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">거래 정보</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">거래 종류</p>
                    <p>{getTransactionTypeText()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">거래 시간</p>
                    <p>{formatDate(transaction.date)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">처리 시간</p>
                    <p>{transaction.processingTime ? formatDate(transaction.processingTime) : "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">거래 수수료</p>
                    <p>{transaction.fee ? formatCurrency(transaction.fee, "KRW") : "없음"}</p>
                  </div>
                </div>
              </div>

              {/* 계좌 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">계좌 정보</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {transaction.type === "DEPOSIT" && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">보낸 사람</p>
                        <p>{transaction.senderName || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">출금 계좌</p>
                        <p>{transaction.senderAccount || "-"}</p>
                      </div>
                    </>
                  )}

                  {transaction.type === "TRANSFER" && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">받는 사람</p>
                        <p>{transaction.recipientName || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">입금 계좌</p>
                        <p>{transaction.recipientAccount || "-"}</p>
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">내 계좌</p>
                    <p>{account?.accountName || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">계좌 번호</p>
                    <p>{account?.accountNumber || "-"}</p>
                  </div>
                </div>
              </div>

              {/* 환전 정보 (환전인 경우에만 표시) */}
              {transaction.type === "EXCHANGE" && transaction.exchangeRate && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">환전 정보</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">환전 통화</p>
                      <p>USD (미국 달러)</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">적용 환율</p>
                      <p>1 USD = {formatCurrency(transaction.exchangeRate, "KRW")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">환전 금액</p>
                      <p>{formatCurrency(Math.abs(transaction.amount), "KRW")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">수령 금액</p>
                      <p>{transaction.exchangedAmount ? formatCurrency(transaction.exchangedAmount, "USD") : "-"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 메모 */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">거래 메모</h3>
                <p className="rounded-lg border p-4">{transaction.description || "메모 없음"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
