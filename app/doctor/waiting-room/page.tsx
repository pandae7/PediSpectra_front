'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Circle,
  Clock,
  FileUp,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  XCircle,
} from 'lucide-react'
import { useDoctor } from '@/lib/doctor-context'
import {
  CREDENTIAL_LABELS,
  type CredentialType,
  type DoctorNotice,
  type DoctorVerification,
} from '@/lib/mock-data'
import {
  STATUS_LABEL,
  applyAdminDecision,
  submissionNotice,
} from '@/lib/doctor-verification'
import { ThemeSelector } from '@/components/ui/theme-selector'

const NOTICE_STYLE: Record<DoctorNotice['kind'], { icon: typeof Bell; cls: string }> = {
  info: { icon: Bell, cls: 'border-border bg-card text-foreground' },
  action: { icon: AlertCircle, cls: 'border-amber-500/40 bg-amber-500/10 text-foreground' },
  success: { icon: CheckCircle2, cls: 'border-primary/40 bg-primary/10 text-foreground' },
  error: { icon: XCircle, cls: 'border-destructive/40 bg-destructive/10 text-foreground' },
}

const CHANNEL_LABEL = { in_app: 'In app', whatsapp: 'WhatsApp', email: 'Email' } as const

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

export default function WaitingRoomPage() {
  const router = useRouter()
  const { currentDoctor, updateDoctor, logout } = useDoctor()
  const [adminNote, setAdminNote] = useState('')
  const [reg, setReg] = useState('')
  const [docEdits, setDocEdits] = useState<Partial<Record<CredentialType, string>>>({})

  // The /doctor layout guarantees a signed-in doctor here.
  if (!currentDoctor) return null
  const v = currentDoctor.verification
  const status = v?.status ?? 'approved'

  const markAllRead = () => {
    if (!v) return
    updateDoctor({
      ...currentDoctor,
      verification: { ...v, notices: v.notices.map((n) => ({ ...n, read: true })) },
    })
  }

  const resubmit = () => {
    if (!v) return
    const documents = v.documents.map((d) => ({ ...d, fileName: docEdits[d.type] ?? d.fileName }))
    for (const [type, fileName] of Object.entries(docEdits) as [CredentialType, string][]) {
      if (!documents.some((d) => d.type === type)) documents.push({ type, fileName })
    }
    const next: DoctorVerification = {
      ...v,
      status: 'pending_review',
      registrationNumber: reg.trim() || v.registrationNumber,
      documents,
      submittedAt: new Date().toISOString(),
      reviewedAt: undefined,
      reviewNote: undefined,
      notices: [submissionNotice(true), ...v.notices],
    }
    updateDoctor({ ...currentDoctor, verification: next })
    setDocEdits({})
    setReg('')
  }

  const decide = (d: 'approve' | 'request_changes' | 'reject') => {
    updateDoctor(applyAdminDecision(currentDoctor, d, adminNote))
    setAdminNote('')
  }

  const steps = [
    { label: 'Application submitted', done: true },
    { label: 'Documents under review', done: status !== 'pending_review', active: status === 'pending_review' },
    {
      label:
        status === 'rejected' ? 'Not approved' : status === 'changes_requested' ? 'Changes requested' : 'Approved and listed',
      done: status === 'approved',
      active: status === 'changes_requested' || status === 'rejected',
    },
  ]

  const canResubmit = status === 'changes_requested' || status === 'rejected'
  const unread = v?.notices.filter((n) => !n.read).length ?? 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              One Roof <span className="text-primary">Pediatrics</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <button
              onClick={() => { logout(); router.push('/') }}
              className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {currentDoctor.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {status === 'approved'
              ? 'You are verified. Your dashboard is ready.'
              : 'Your account is created. The portal opens once our team verifies your registration.'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Status */}
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6 lg:col-span-2">
            <div className="flex items-center gap-2">
              {status === 'approved' ? (
                <ShieldCheck className="h-5 w-5 text-primary" />
              ) : status === 'rejected' ? (
                <XCircle className="h-5 w-5 text-destructive" />
              ) : status === 'changes_requested' ? (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              ) : (
                <Clock className="h-5 w-5 text-primary" />
              )}
              <h2 className="font-semibold text-foreground">{STATUS_LABEL[status]}</h2>
            </div>

            <ol className="space-y-3">
              {steps.map((s) => (
                <li key={s.label} className="flex items-center gap-3 text-sm">
                  {s.done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className={`h-5 w-5 ${s.active ? 'text-primary' : 'text-muted-foreground/50'}`} />
                  )}
                  <span className={s.done || s.active ? 'text-foreground' : 'text-muted-foreground'}>{s.label}</span>
                </li>
              ))}
            </ol>

            {status === 'pending_review' && (
              <p className="text-xs text-muted-foreground">Reviews usually take 1 to 2 working days.</p>
            )}
            {v?.reviewNote && status !== 'approved' && (
              <p className="rounded-lg bg-muted/40 p-3 text-sm text-foreground">
                <span className="font-medium">Note from our team: </span>
                {v.reviewNote}
              </p>
            )}
            {status === 'approved' && (
              <button
                onClick={() => router.push('/doctor/dashboard')}
                className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground hover:opacity-90"
              >
                Go to dashboard
              </button>
            )}

            {v && (
              <dl className="space-y-1.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Registration</dt>
                  <dd className="text-right text-foreground">{v.registrationNumber}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Council</dt>
                  <dd className="text-right text-foreground">{v.council}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="text-right text-foreground">{v.email}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Submitted</dt>
                  <dd className="text-right text-foreground">{fmt(v.submittedAt)}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-muted-foreground">Documents</dt>
                  <dd>
                    <ul className="space-y-0.5">
                      {v.documents.map((d) => (
                        <li key={d.type} className="truncate text-xs text-foreground">
                          {CREDENTIAL_LABELS[d.type]}: <span className="text-muted-foreground">{d.fileName}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            )}
          </section>

          {/* Alerts */}
          <section className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <Bell className="h-5 w-5 text-primary" />
                Alerts
                {unread > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{unread}</span>
                )}
              </h2>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  Mark all as read
                </button>
              )}
            </div>
            <ul className="space-y-3">
              {(v?.notices ?? []).map((n) => {
                const { icon: Icon, cls } = NOTICE_STYLE[n.kind]
                return (
                  <li key={n.id} className={`rounded-xl border p-4 ${cls}`}>
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold">
                            {n.title}
                            {!n.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" aria-label="Unread" />}
                          </p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{fmt(n.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          Sent via
                          {n.channels.map((c) => (
                            <span key={c} className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5">
                              {c === 'whatsapp' && <MessageCircle className="h-3 w-3" />}
                              {CHANNEL_LABEL[c]}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
              {(v?.notices.length ?? 0) === 0 && (
                <li className="text-sm text-muted-foreground">No alerts yet.</li>
              )}
            </ul>
          </section>
        </div>

        {/* Resubmit */}
        {canResubmit && v && (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div>
              <h2 className="font-semibold text-foreground">Update and resubmit</h2>
              <p className="text-sm text-muted-foreground">
                Correct your registration number or replace documents, then send them for another review.
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Registration number</label>
              <input
                value={reg}
                onChange={(e) => setReg(e.target.value)}
                placeholder={v.registrationNumber}
                maxLength={30}
                className="h-11 w-full max-w-sm rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              {v.documents.map((d) => (
                <label
                  key={d.type}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 hover:border-primary/50"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{CREDENTIAL_LABELS[d.type]}</span>
                    <span className="block truncate text-xs text-muted-foreground">{docEdits[d.type] ?? d.fileName}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground">
                    <FileUp className="h-3.5 w-3.5" /> Replace
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) setDocEdits((x) => ({ ...x, [d.type]: f.name }))
                    }}
                  />
                </label>
              ))}
            </div>
            <button
              onClick={resubmit}
              className="h-11 rounded-lg bg-primary px-6 font-medium text-primary-foreground hover:opacity-90"
            >
              Resubmit for review
            </button>
          </section>
        )}

        {/* Demo-only admin simulator */}
        {v && status !== 'approved' && (
          <section className="space-y-3 rounded-2xl border border-dashed border-border bg-muted/20 p-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Demo only: simulate admin review</h2>
              <p className="text-xs text-muted-foreground">
                In the live product the CEO-office team does this. This panel will be removed.
              </p>
            </div>
            <input
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Optional note to the doctor"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => decide('approve')} className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
                Approve
              </button>
              <button onClick={() => decide('request_changes')} className="h-9 rounded-lg border border-border px-4 text-sm text-foreground hover:bg-muted/40">
                Request changes
              </button>
              <button onClick={() => decide('reject')} className="h-9 rounded-lg border border-destructive/50 px-4 text-sm text-destructive hover:bg-destructive/10">
                Reject
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
