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
import { formatCurrency } from "@/lib/utils"
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ExchangePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { accounts, exchangeRates, exchangeCurrency, isLoading: dataLoading } = useBankData()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [fromAccountId, setFromAccountId] = useState("")
  const [toCurrency, setToCurrency] = useState("USD")
  const [amount, setAmount] = useState("")
  const [exchangedAmount, setExchangedAmount] = useState(0)
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

  // 환전 금액 계산
  useEffect(() => {
    const exchangeAmount = Number.parseFloat(amount)
    if (!isNaN(exchangeAmount) && exchangeAmount > 0) {
      const rate = exchangeRates.find((rate) => rate.currency === toCurrency)?.rate || 0
      setExchangedAmount(exchangeAmount / rate)
    } else {
      setExchangedAmount(0)
    }
  }, [amount, toCurrency, exchangeRates])

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
  const selectedRate = exchangeRates.find((rate) => rate.currency === toCurrency)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!fromAccountId) {
      setError("출금 계좌를 선택해주세요.")
      return
    }

    if (!toCurrency) {
      setError("환전할 통화를 선택해주세요.")
      return
    }

    const exchangeAmount = Number.parseFloat(amount)
    if (isNaN(exchangeAmount) || exchangeAmount <= 0) {
      setError("유효한 금액을 입력해주세요.")
      return
    }

    if (!selectedAccount || selectedAccount.balance < exchangeAmount) {
      setError("잔액이 부족합니다.")
      return
    }

    setIsLoading(true)

    try {
      const result = await exchangeCurrency(fromAccountId, toCurrency, exchangeAmount)

      if (result) {
        setSuccess(true)
        setAmount("")
      } else {
        setError("환전 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } catch (err) {
      setError("환전 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">환전</h1>

          <Card>
            <CardHeader>
              <CardTitle>환전하기</CardTitle>
              <CardDescription>원화를 외화로 환전할 수 있습니다.</CardDescription>
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
                    <AlertDescription className="text-green-800">환전이 성공적으로 완료되었습니다.</AlertDescription>
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
                  <Label htmlFor="toCurrency">환전 통화</Label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger id="toCurrency">
                      <SelectValue placeholder="환전 통화 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {exchangeRates.map((rate) => (
                        <SelectItem key={rate.currency} value={rate.currency}>
                          {rate.flag} {rate.name} ({rate.currency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRate && (
                    <p className="text-sm text-muted-foreground">
                      현재 환율: 1 {selectedRate.currency} = {formatCurrency(selectedRate.rate, "KRW")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">환전 금액 (원)</Label>
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

                {exchangedAmount > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-center gap-2 py-2">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">환전 금액</p>
                        <p className="font-medium">{formatCurrency(Number.parseFloat(amount), "KRW")}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">수령 금액</p>
                        <p className="font-medium">{formatCurrency(exchangedAmount, toCurrency)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading || accounts.length === 0}>
                  {isLoading ? "처리 중..." : "환전하기"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
