import { cn } from '@/lib/utils'

/**
 * PhoneFrame centers the mobile-first flow. On small screens it is full-bleed
 * (the phone IS the device). On larger screens it renders a centered device
 * frame so the prototype reads like a healthcare workflow tool, not a webpage.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-background sm:items-center sm:bg-[#0a0e10] sm:py-8">
      <div
        className={cn(
          'relative flex w-full flex-col bg-background',
          'min-h-dvh',
          'sm:min-h-0 sm:h-[844px] sm:max-w-[390px] sm:overflow-y-auto sm:rounded-[2.25rem] sm:border sm:border-border sm:shadow-2xl',
        )}
      >
        {children}
      </div>
    </div>
  )
}
