import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "./navbar"

export function AccountCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full">
      <div className="p-6 pb-2 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="p-6 pt-0 space-y-2">
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}

export function TransactionItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-5 w-20" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          {/* 환영 메시지 스켈레톤 */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* 계좌 요약 스켈레톤 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AccountCardSkeleton />
              <AccountCardSkeleton />
              <AccountCardSkeleton />
            </div>
          </div>

          {/* 빠른 액션 스켈레톤 */}
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>

          {/* 최근 거래 내역 스켈레톤 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="rounded-lg border p-6 space-y-4">
              <TransactionItemSkeleton />
              <TransactionItemSkeleton />
              <TransactionItemSkeleton />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export function AccountDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 mr-4 rounded-full" />
            <Skeleton className="h-9 w-64" />
          </div>

          <div className="rounded-lg border p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-9 w-40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                <Skeleton className="h-10 w-28 rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex border-b">
              <Skeleton className="h-10 w-1/2 rounded-t-md" />
              <Skeleton className="h-10 w-1/2 rounded-t-md" />
            </div>
            <div className="rounded-lg border p-6 space-y-4">
              <TransactionItemSkeleton />
              <TransactionItemSkeleton />
              <TransactionItemSkeleton />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export function TransactionDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 mr-4 rounded-full" />
            <Skeleton className="h-9 w-64" />
          </div>

          <div className="rounded-lg border">
            <div className="p-6 flex flex-row items-center justify-between border-b">
              <div className="space-y-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            <div className="p-6 space-y-8">
              <Skeleton className="h-24 w-full rounded-lg" />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <Skeleton className="h-5 w-32" />
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 rounded-full mr-2" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export function TransferFormSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <Skeleton className="h-9 w-32 mb-6" />

          <div className="rounded-lg border">
            <div className="p-6 border-b space-y-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>
            <div className="p-6 border-t">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export function ExchangeFormSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <Skeleton className="h-9 w-32 mb-6" />

          <div className="rounded-lg border">
            <div className="p-6 border-b space-y-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-4 w-48" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="text-center space-y-1">
                    <Skeleton className="h-4 w-20 mx-auto" />
                    <Skeleton className="h-5 w-24 mx-auto" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="text-center space-y-1">
                    <Skeleton className="h-4 w-20 mx-auto" />
                    <Skeleton className="h-5 w-24 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export function TransactionSuccessSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>

          <div className="rounded-lg border">
            <div className="p-6 border-b space-y-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-64" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-48" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-64" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <div className="p-6 border-t space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
