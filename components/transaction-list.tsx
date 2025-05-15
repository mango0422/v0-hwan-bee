import type { Transaction } from "@/types/bank"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, RefreshCw, ArrowLeftRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TransactionListProps {
  transactions: Transaction[]
  showAccountInfo?: boolean
}

export function TransactionList({ transactions, showAccountInfo = false }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">거래 내역이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Link href={`/transactions/${transaction.id}`} key={transaction.id}>
          <div
            className={cn(
              "flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50",
              "transaction-item card-hover",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {transaction.type === "DEPOSIT" && <ArrowDownLeft className="h-5 w-5 text-green-500" />}
                {transaction.type === "WITHDRAWAL" && <ArrowUpRight className="h-5 w-5 text-red-500" />}
                {transaction.type === "TRANSFER" && <ArrowLeftRight className="h-5 w-5 text-blue-500" />}
                {transaction.type === "EXCHANGE" && <RefreshCw className="h-5 w-5 text-orange-500" />}
              </div>
              <div>
                <div className="font-medium">{transaction.description}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(transaction.date)}
                  {transaction.recipientName && ` • ${transaction.recipientName}`}
                </div>
              </div>
            </div>
            <div className={`text-right ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
              {formatCurrency(transaction.amount, "KRW")}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
