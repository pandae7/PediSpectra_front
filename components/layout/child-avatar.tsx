import { getChildAccent } from '@/lib/child-theme'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'h-6 w-6 text-[11px]',
  md: 'h-8 w-8 text-sm',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-2xl',
}

interface ChildAvatarProps {
  child: { id: string; name: string }
  siblings: { id: string }[]
  size?: keyof typeof SIZES
  className?: string
}

// Round initial in the child's accent colour, so parents can tell profiles apart at a glance.
export function ChildAvatar({ child, siblings, size = 'md', className }: ChildAvatarProps) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: getChildAccent(siblings, child.id) }}
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white', SIZES[size], className)}
    >
      {child.name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  )
}