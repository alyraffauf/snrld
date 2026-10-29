import type { Repo } from './types'
export async function getDefaultBranch(repo: Repo): Promise<{ name: string }> {
  return { name: repo.git?.defaultBranch || 'HEAD' }
}
