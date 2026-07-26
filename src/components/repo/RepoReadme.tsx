import type { Handle } from '@atcute/lexicons'
import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { defaultUrlTransform, type UrlTransform } from 'react-markdown'
import { MarkdownContent } from '../shared/MarkdownContent'
import { SurfaceCard } from '../shared/SurfaceCard'

const URL_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i

type RepoReadmeProps = {
  readme: NonNullable<RepoTreeResponse['readme']> | undefined
  repositoryOwner: Handle
  repositoryName: string
  repositoryRef: string
}

export function RepoReadme({
  readme,
  repositoryOwner,
  repositoryName,
  repositoryRef,
}: RepoReadmeProps) {
  if (!readme?.contents.trim()) return null
  const urlTransform = createRepositoryUrlTransform(repositoryOwner, repositoryName, repositoryRef)

  return (
    <SurfaceCard as="section" className="min-w-0 p-4 sm:p-6">
      <h2 className="font-mono text-base font-semibold text-ctp-text">{readme.filename}</h2>
      <MarkdownContent className="mt-4 text-sm text-ctp-subtext-1" urlTransform={urlTransform}>
        {readme.contents}
      </MarkdownContent>
    </SurfaceCard>
  )
}

function createRepositoryUrlTransform(
  repositoryOwner: Handle,
  repositoryName: string,
  repositoryRef: string,
): UrlTransform {
  const rawFileBaseUrl = `https://tangled.org/${encodeURIComponent(repositoryOwner)}/${encodeURIComponent(repositoryName)}/raw/${encodeURIComponent(repositoryRef)}/`

  return (url) => {
    const safeUrl = defaultUrlTransform(url)
    if (!isRepositoryRelativeUrl(safeUrl)) return safeUrl

    return new URL(safeUrl, rawFileBaseUrl).toString()
  }
}

function isRepositoryRelativeUrl(url: string): boolean {
  return !url.startsWith('#') && !url.startsWith('/') && !URL_SCHEME_PATTERN.test(url)
}
