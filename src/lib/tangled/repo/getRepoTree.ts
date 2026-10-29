import { getTree, type RepoTree } from '../git'
import type { Repo } from './types'
export async function getRepoTree(
  repo: Repo,
  path = '',
  ref = repo.git?.defaultBranch || 'HEAD',
): Promise<RepoTree> {
  if (repo.git?.isEmpty) return { files: [], ref }
  return getTree(repo.repoDid, ref, path)
}
