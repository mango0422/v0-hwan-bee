import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Account } from "@/types/bank"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <Link href={`/accounts/${account.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{account.accountName}</CardTitle>
          <CardDescription>{account.accountNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(account.balance, account.currency)}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {account.type === "CHECKING" && "입출금 계좌"}
            {account.type === "SAVINGS" && "적금 계좌"}
            {account.type === "DEPOSIT" && "예금 계좌"}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
