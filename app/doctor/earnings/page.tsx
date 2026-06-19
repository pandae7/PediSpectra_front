'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CreditCard, IndianRupee, TrendingUp, Wallet } from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import { Navbar } from '@/components/layout/navbar'

export default function DoctorEarningsPage() {
  const router = useRouter()
  const { currentDoctor, getCompleted, isLoading } = useDoctor()

  useEffect(() => {
    if (!isLoading && !currentDoctor) router.push('/login/doctor')
  }, [currentDoctor, isLoading, router])

  if (isLoading || !currentDoctor) return null

  const completed = getCompleted()
  const totalConsultations = completed.length
  const fee = currentDoctor.fee
  const platformCommission = 0.15 // 15%
  const grossEarnings = totalConsultations * fee
  const platformCut = Math.round(grossEarnings * platformCommission)
  const netEarnings = grossEarnings - platformCut
  const credited = Math.round(netEarnings * 0.7) // 70% already credited
  const pending = netEarnings - credited

  // Mock transaction history
  const transactions = [
    { id: 'txn-001', date: '2025-06-22', amount: Math.round(fee * 0.85), status: 'credited', description: 'Consultation - Aarav (Cardiology)' },
    { id: 'txn-002', date: '2025-06-20', amount: Math.round(fee * 0.85), status: 'credited', description: 'Consultation - Aditi (Neurology)' },
    { id: 'txn-003', date: '2025-06-15', amount: Math.round(fee * 0.85), status: 'credited', description: 'Consultation - Aditya (Pulmonology)' },
    { id: 'txn-004', date: '2025-06-28', amount: Math.round(fee * 0.85), status: 'pending', description: 'Consultation - Recent patient' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/doctor/dashboard" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Earnings & Settlements</h1>

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalConsultations}</p>
                <p className="text-xs text-muted-foreground">Total Consultations</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₹{netEarnings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Net Earnings</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">₹{credited.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Credited</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-500">₹{pending.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">Earnings Breakdown</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Consultation fee (per session)</span>
              <span className="font-medium text-foreground">₹{fee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed consultations</span>
              <span className="font-medium text-foreground">{totalConsultations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross earnings</span>
              <span className="font-medium text-foreground">₹{grossEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-destructive">
              <span>Platform commission (15%)</span>
              <span>– ₹{platformCut.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="font-semibold text-foreground">Net payable</span>
              <span className="text-lg font-bold text-primary">₹{netEarnings.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">Recent Transactions</h2>
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">₹{txn.amount}</p>
                  <span className={`text-xs font-medium ${txn.status === 'credited' ? 'text-green-500' : 'text-amber-500'}`}>
                    {txn.status === 'credited' ? '✓ Credited' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout info */}
        <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
          Settlements are processed every Monday. Next payout: ₹{pending.toLocaleString()} on Monday.
        </div>
      </div>
    </div>
  )
}
