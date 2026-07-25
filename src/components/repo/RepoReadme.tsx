import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { MarkdownContent } from '../shared/MarkdownContent'

type RepoReadmeProps = {
  readme: NonNullable<RepoTreeResponse['readme']> | undefined
}

export function RepoReadme({ readme }: RepoReadmeProps) {
  if (!readme?.contents.trim()) return null

  return (
    <details className="rounded border border-ctp-surface-1 bg-ctp-mantle p-4">
      <summary className="cursor-pointer font-mono text-base font-semibold text-ctp-text">
        {readme.filename}
      </summary>
      <MarkdownContent className="mt-4 max-h-96 overflow-auto text-sm text-ctp-subtext-1">
        {readme.contents}
      </MarkdownContent>
    </details>
  )
}
