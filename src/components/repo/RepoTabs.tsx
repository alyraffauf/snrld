import type { Handle } from '@atcute/lexicons'
import {
  IconBook2,
  IconCircleDot,
  IconGitPullRequest,
  IconNotebook,
  IconRoute,
} from '@tabler/icons-react'
import { Tabs } from '../shared/Tabs'
import type { RepoSection } from './repoSections'

type RepoTabsProps = {
  activeSection: RepoSection
  handle: Handle
  hasReadme: boolean
  repoKey: string
}

const REPO_TABS = [
  { label: 'Readme', section: 'readme' as const, Icon: IconBook2 },
  { label: 'Code', section: 'code' as const, Icon: IconNotebook },
  { label: 'Issues', section: 'issues' as const, Icon: IconCircleDot },
  { label: 'Pulls', section: 'pulls' as const, Icon: IconGitPullRequest },
  { label: 'Pipelines', section: 'pipelines' as const, Icon: IconRoute },
]

export function RepoTabs({ activeSection, handle, hasReadme, repoKey }: RepoTabsProps) {
  const basePath = `/${handle}/${encodeURIComponent(repoKey)}`
  const defaultSection = hasReadme ? 'readme' : 'code'

  return (
    <Tabs
      ariaLabel="Repository sections"
      items={REPO_TABS.filter((tab) => hasReadme || tab.section !== 'readme').map((tab) => {
        const Icon = tab.Icon
        const href = tab.section === defaultSection ? basePath : `${basePath}?view=${tab.section}`

        return {
          label: tab.label,
          href,
          isActive: tab.section === activeSection,
          icon: <Icon size={16} stroke={1.75} aria-hidden="true" />,
        }
      })}
    />
  )
}
