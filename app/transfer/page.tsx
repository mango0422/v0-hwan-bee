"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { useBankData } from "@/context/bank-data-context"
import { formatCurrency, formatAccountNumber } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

export default function TransferPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { accounts, transferMoney, isLoading: dataLoading } = useBankData()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [fromAccountId, setFromAccountId] = useState("")
  const [toAccountNumber, setToAccountNumber] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }

    // URL 파라미터에서 계좌 ID 가져오기
    const fromParam = searchParams.get("from")
    if (fromParam) {
      setFromAccountId(fromParam)
    } else if (accounts.length > 0) {
      setFromAccountId(accounts[0].id)
    }
  }, [authLoading, isAuthenticated, router, searchParams, accounts])

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

  const selectedAccount = accounts.find((account) => account.id === fromAccountId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!fromAccountId) {
      setError("출금 계좌를 선택해주세요.")
      return
    }

    if (!toAccountNumber) {
      setError("입금 계좌번호를 입력해주세요.")
      return
    }

    if (!recipientName) {
      setError("수취인 이름을 입력해주세요.")
      return
    }

    const transferAmount = Number.parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError("유효한 금액을 입력해주세요.")
      return
    }

    if (!selectedAccount || selectedAccount.balance < transferAmount) {
      setError("잔액이 부족합니다.")
      return
    }

    setIsLoading(true)

    try {
      const result = await transferMoney(
        fromAccountId,
        toAccountNumber,
        transferAmount,
        description || `${recipientName}님에게 송금`,
      )

      if (result) {
        setSuccess(true)
        setToAccountNumber("")
        setRecipientName("")
        setAmount("")
        setDescription("")
      } else {
        setError("송금 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } catch (err) {
      setError("송금 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">송금</h1>

          <Card>
            <CardHeader>
              <CardTitle>송금하기</CardTitle>
              <CardDescription>다른 계좌로 송금할 수 있습니다.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">송금이 성공적으로 완료되었습니다.</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fromAccount">출금 계좌</Label>
                  <Select value={fromAccountId} onValueChange={setFromAccountId}>
                    <SelectTrigger id="fromAccount">
                      <SelectValue placeholder="출금 계좌 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.length === 0 ? (
                        <SelectItem value="none" disabled>
                          계좌가 없습니다
                        </SelectItem>
                      ) : (
                        accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.accountName} ({formatCurrency(account.balance, account.currency)})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toAccountNumber">입금 계좌번호</Label>
                  <Input
                    id="toAccountNumber"
                    value={toAccountNumber}
                    onChange={(e) => setToAccountNumber(formatAccountNumber(e.target.value))}
                    placeholder="123-456-789012"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientName">수취인 이름</Label>
                  <Input
                    id="recipientName"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="홍길동"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">금액 (원)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="10000"
                    required
                  />
                  {selectedAccount && (
                    <p className="text-sm text-muted-foreground">
                      잔액: {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">내용 (선택)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="송금 내용을 입력하세요"
                    className="resize-none"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading || accounts.length === 0}>
                  {isLoading ? "처리 중..." : "송금하기"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
