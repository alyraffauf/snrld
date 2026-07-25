import type { Handle } from '@atcute/lexicons'
import { IconArticle, IconNote, IconNotebook, IconStar } from '@tabler/icons-react'
import { useSearchParams } from 'react-router-dom'
import { Tabs } from '../shared/Tabs'

type ProfileSection = 'overview' | 'repos' | 'strings' | 'stars'

type ProfileTabsProps = {
  handle: Handle
}

const PROFILE_TABS = [
  { label: 'Overview', section: 'overview', Icon: IconArticle },
  { label: 'Repositories', section: 'repos', Icon: IconNotebook },
  { label: 'Strings', section: 'strings', Icon: IconNote },
  { label: 'Stars', section: 'stars', Icon: IconStar },
] as const

export function ProfileTabs({ handle }: ProfileTabsProps) {
  const [searchParams] = useSearchParams()
  const activeSection = parseProfileSection(searchParams.get('view'))

  return (
    <div className="mt-8">
      <Tabs
        ariaLabel="Profile sections"
        items={PROFILE_TABS.map((tab) => {
          const Icon = tab.Icon
          const search = tab.section === 'overview' ? '' : `?view=${tab.section}`

          return {
            label: tab.label,
            href: `/${handle}${search}`,
            isActive: tab.section === activeSection,
            icon: <Icon size={15} stroke={1.75} aria-hidden="true" />,
          }
        })}
      />
    </div>
  )
}

function parseProfileSection(value: string | null): ProfileSection {
  if (value === 'repos' || value === 'strings' || value === 'stars') {
    return value
  }

  return 'overview'
}
