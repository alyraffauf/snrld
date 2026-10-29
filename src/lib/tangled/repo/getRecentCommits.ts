import type { Repo } from './types'
import { getRepoLog } from './getRepoLog'
export type RepoCommit = {
  hash: string
  message: string
  author?: { Name?: string; Email?: string; When?: string }
}
export type RecentCommitsOptions = { branch?: string; limit?: number }
export async function getRecentCommits(
  repo: Repo,
  options: RecentCommitsOptions = {},
): Promise<RepoCommit[]> {
  const commits = await getRepoLog(repo, options.branch || repo.git?.defaultBranch || 'HEAD', {
    limit: options.limit ?? 5,
  })
  return commits.map((commit) => ({
    hash: commit.oid,
    message: commit.message,
    author: { Name: commit.author?.name, Email: commit.author?.email, When: commit.author?.when },
  }))
}
