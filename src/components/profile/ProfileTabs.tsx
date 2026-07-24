import type { Handle } from '@atcute/lexicons'
import { IconArticle, IconNote, IconNotebook } from '@tabler/icons-react'
import { Link, useSearchParams } from 'react-router-dom'

type ProfileSection = 'overview' | 'repos' | 'strings'

type ProfileTabsProps = {
  handle: Handle
}

const PROFILE_TABS = [
  { label: 'Overview', section: 'overview', Icon: IconArticle },
  { label: 'Repositories', section: 'repos', Icon: IconNotebook },
  { label: 'Strings', section: 'strings', Icon: IconNote },
] as const

export function ProfileTabs({ handle }: ProfileTabsProps) {
  const [searchParams] = useSearchParams()
  const activeSection = parseProfileSection(searchParams.get('view'))

  return (
    <nav aria-label="Profile sections" className="mt-8 border-b border-ctp-surface-0">
      <div className="flex gap-6 overflow-x-auto">
        {PROFILE_TABS.map((tab) => {
          const isActive = tab.section === activeSection
          const search = tab.section === 'overview' ? '' : `?view=${tab.section}`
          const Icon = tab.Icon

          return (
            <Link
              key={tab.section}
              to={`/${handle}${search}`}
              aria-current={isActive ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2 border-b-2 pb-3 text-sm transition-colors ${isActive
                ? 'border-ctp-lavender font-semibold text-ctp-text'
                : 'border-transparent text-ctp-overlay-1 hover:border-ctp-surface-1 hover:text-ctp-text'
                }`}
            >
              <Icon size={15} stroke={1.75} aria-hidden="true" />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function parseProfileSection(value: string | null): ProfileSection {
  if (value === 'repos' || value === 'strings') {
    return value
  }

  return 'overview'
}
