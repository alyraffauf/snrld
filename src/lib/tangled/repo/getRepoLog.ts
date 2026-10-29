import { listCommits } from '../git'
import type { Repo } from './types'
export type RepoLogOptions = { skip?: number; limit?: number }
export async function getRepoLog(repo: Repo, ref: string, options: RepoLogOptions = {}) {
  if (repo.git?.isEmpty) return []
  return listCommits(repo.repoDid, ref, options.limit, options.skip)
}
