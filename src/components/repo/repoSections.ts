export type RepoSection = 'readme' | 'code' | 'issues' | 'pulls' | 'pipelines'

export function parseRepoSection(value: string | null, hasReadme: boolean): RepoSection {
  if (value === 'readme' && hasReadme) return 'readme'
  if (value === 'issues') return 'issues'
  if (value === 'pulls') return 'pulls'
  if (value === 'pipelines') return 'pipelines'
  if (value === 'code') return 'code'

  return hasReadme ? 'readme' : 'code'
}
