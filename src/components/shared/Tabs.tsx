import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type TabsItem = {
  label: string
  href: string
  isActive: boolean
  icon?: ReactNode
}

type TabsProps = {
  ariaLabel: string
  items: readonly TabsItem[]
}

export function Tabs({ ariaLabel, items }: TabsProps) {
  return (
    <nav aria-label={ariaLabel} className="border-b border-ctp-surface-0">
      <div className="flex gap-5 overflow-x-auto overscroll-x-contain px-1 [-webkit-overflow-scrolling:touch] sm:gap-6">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            aria-current={item.isActive ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-2 border-b-2 pb-3 text-base transition-colors ${
              item.isActive
                ? 'border-ctp-lavender font-semibold text-ctp-text'
                : 'border-transparent font-medium text-ctp-subtext-0 hover:border-ctp-surface-1 hover:text-ctp-text'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
