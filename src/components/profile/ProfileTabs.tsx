import type { Handle } from '@atcute/lexicons'
import { IconArticle, IconNote, IconNotebook, IconStar, IconThumbUp } from '@tabler/icons-react'
import { useSearchParams } from 'react-router-dom'
import { parseProfileSection } from '../../lib/profile'
import { Tabs } from '../shared/Tabs'

type ProfileTabsProps = {
  handle: Handle
}

const PROFILE_TABS = [
  { label: 'Overview', section: 'overview', Icon: IconArticle },
  { label: 'Repositories', section: 'repos', Icon: IconNotebook },
  { label: 'Strings', section: 'strings', Icon: IconNote },
  { label: 'Stars', section: 'stars', Icon: IconStar },
  { label: 'Vouches', section: 'vouches', Icon: IconThumbUp },
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
