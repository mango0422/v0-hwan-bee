"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AccountCard } from "@/components/account-card"
import { useAuth } from "@/context/auth-context"
import { useBankData } from "@/context/bank-data-context"
import { Plus, PiggyBank } from "lucide-react"
import Link from "next/link"

export default function AccountsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { accounts, isLoading: dataLoading } = useBankData()
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">내 계좌</h1>
            <p className="text-muted-foreground mt-1">모든 계좌를 한눈에 확인하고 관리하세요.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">계좌 목록</h2>
              <Link href="/accounts/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> 계좌 개설
                </Button>
              </Link>
            </div>

            {accounts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <PiggyBank className="h-16 w-16 text-muted-foreground mb-4" />
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
        </div>
      </main>
    </div>
  )
}
