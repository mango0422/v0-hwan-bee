"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { useBankData } from "@/context/bank-data-context"
import { AccountType } from "@/types/bank"
import { generateAccountNumber } from "@/lib/utils"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NewAccountPage() {
  const [accountName, setAccountName] = useState("")
  const [accountType, setAccountType] = useState<AccountType>(AccountType.CHECKING)
  const [initialDeposit, setInitialDeposit] = useState("0")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { isAuthenticated } = useAuth()
  const { createAccount } = useBankData()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!accountName.trim()) {
      setError("계좌 이름을 입력해주세요.")
      return
    }

    const deposit = Number.parseFloat(initialDeposit)
    if (isNaN(deposit) || deposit < 0) {
      setError("유효한 금액을 입력해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const newAccount = await createAccount({
        accountNumber: generateAccountNumber(),
        accountName,
        balance: deposit,
        currency: "KRW",
        type: accountType,
      })

      router.push(`/accounts/${newAccount.id}`)
    } catch (err) {
      setError("계좌 개설 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">계좌 개설</h1>

          <Card>
            <CardHeader>
              <CardTitle>새 계좌 개설</CardTitle>
              <CardDescription>새로운 계좌를 개설하고 금융 생활을 시작하세요.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="accountName">계좌 이름</Label>
                  <Input
                    id="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="예: 생활비 계좌"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">계좌 종류</Label>
                  <Select value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
                    <SelectTrigger id="accountType">
                      <SelectValue placeholder="계좌 종류 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AccountType.CHECKING}>입출금 계좌</SelectItem>
                      <SelectItem value={AccountType.SAVINGS}>적금 계좌</SelectItem>
                      <SelectItem value={AccountType.DEPOSIT}>예금 계좌</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialDeposit">초기 입금액 (원)</Label>
                  <Input
                    id="initialDeposit"
                    type="number"
                    min="0"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "처리 중..." : "계좌 개설하기"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
