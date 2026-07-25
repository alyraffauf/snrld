import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { MarkdownContent } from '../shared/MarkdownContent'
import { SurfaceCard } from '../shared/SurfaceCard'

type RepoReadmeProps = {
  readme: NonNullable<RepoTreeResponse['readme']> | undefined
}

export function RepoReadme({ readme }: RepoReadmeProps) {
  if (!readme?.contents.trim()) return null

  return (
    <SurfaceCard as="section" className="p-6">
      <h2 className="font-mono text-base font-semibold text-ctp-text">{readme.filename}</h2>
      <MarkdownContent className="mt-4 text-sm text-ctp-subtext-1">
        {readme.contents}
      </MarkdownContent>
    </SurfaceCard>
  )
}
