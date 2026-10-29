import { gitBlobUrl } from '../../lib/tangled/git'
import type { Did } from '@atcute/lexicons'
import type { RepoTree as RepoTreeResponse } from '../../lib/tangled/git'
import { defaultUrlTransform, type UrlTransform } from 'react-markdown'
import { MarkdownContent } from '../shared/MarkdownContent'
import { SurfaceCard } from '../shared/SurfaceCard'

const URL_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i

type RepoReadmeProps = {
  readme: NonNullable<RepoTreeResponse['readme']> | undefined
  repoDid: Did
  repositoryRef: string
}

export function RepoReadme({ readme, repoDid, repositoryRef }: RepoReadmeProps) {
  if (!readme?.contents.trim()) return null
  const urlTransform = createRepositoryUrlTransform(repoDid, repositoryRef)

  return (
    <SurfaceCard as="section" className="min-w-0 p-4 sm:p-6">
      <h2 className="font-mono text-base font-semibold text-ctp-text">{readme.filename}</h2>
      <MarkdownContent className="mt-4 text-sm text-ctp-subtext-1" urlTransform={urlTransform}>
        {readme.contents}
      </MarkdownContent>
    </SurfaceCard>
  )
}

function createRepositoryUrlTransform(repoDid: Did, repositoryRef: string): UrlTransform {
  return (url) => {
    const safeUrl = defaultUrlTransform(url)
    if (!isRepositoryRelativeUrl(safeUrl)) return safeUrl

    const path = new URL(safeUrl, 'https://repository.invalid/').pathname.slice(1)
    return gitBlobUrl(repoDid, repositoryRef, decodeURIComponent(path))
  }
}

function isRepositoryRelativeUrl(url: string): boolean {
  return !url.startsWith('#') && !url.startsWith('/') && !URL_SCHEME_PATTERN.test(url)
}
