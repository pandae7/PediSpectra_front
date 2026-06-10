'use client'

import { ArrowRight, Languages, MessageCircle, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ActionBar } from '@/components/flow/action-bar'
import { PhoneFrame } from '@/components/flow/phone-frame'
import { StatusPill } from '@/components/flow/status-pill'
import { Button } from '@/components/ui/button'
import { useConsult, type LanguageCode } from '@/lib/consult-context'
import { cn } from '@/lib/utils'

const LANGUAGES: { code: LanguageCode; label: string; helper: string }[] = [
  { code: 'en', label: 'English', helper: 'Continue in English' },
  { code: 'hi', label: 'Hindi', helper: 'Hindi text for demo later' },
  { code: 'te', label: 'Telugu', helper: 'Telugu text for demo later' },
]

export default function InvitePage() {
  const router = useRouter()
  const { language, setFlowMode, setLanguage } = useConsult()

  const continueFlow = () => {
    setFlowMode('normal')
    router.push('/intro')
  }

  return (
    <PhoneFrame>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="size-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">PediSpectra</p>
            <p className="text-[11px] text-muted-foreground">Shared on WhatsApp</p>
          </div>
        </div>
        <StatusPill tone="success" icon={<MessageCircle className="size-3.5" />}>
          Invite
        </StatusPill>
      </div>

      <main className="flex flex-1 flex-col gap-6 px-5 py-7">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Languages className="size-5" />
        </div>

        <div className="space-y-2">
          <h1 className="text-balance text-2xl font-semibold leading-tight text-foreground">
            Choose your preferred language
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We will use this to make the next steps easier to follow for your family.
          </p>
        </div>

        <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Preferred language">
          {LANGUAGES.map((item) => {
            const active = language === item.code
            return (
              <button
                key={item.code}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setFlowMode('normal')
                  setLanguage(item.code)
                }}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-4 text-left transition-colors',
                  active ? 'border-primary bg-primary/15' : 'border-border bg-card',
                )}
              >
                <span>
                  <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.helper}</span>
                </span>
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full border',
                    active ? 'border-primary bg-primary' : 'border-border',
                  )}
                />
              </button>
            )
          })}
        </div>
      </main>

      <ActionBar hint="You can change this later in your profile.">
        <Button size="lg" className="h-12 text-[15px]" disabled={!language} onClick={continueFlow}>
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </ActionBar>
    </PhoneFrame>
  )
}
