import type { ReactNode } from 'react'

type ProfileSectionProps = {
  title: string
  icon?: ReactNode
  children: ReactNode
}

export function ProfileSection({ title, icon, children }: ProfileSectionProps) {
  const headingId = `${title.toLowerCase().replaceAll(' ', '-')}-heading`

  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <h2
        id={headingId}
        className={
          icon
            ? 'flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-ctp-overlay-1'
            : 'sr-only'
        }
      >
        {icon}
        {title}
      </h2>
      {children}
    </section>
  )
}
