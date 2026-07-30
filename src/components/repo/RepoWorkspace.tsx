import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import type { Repo } from '../../lib/tangled'
import { RepoLog } from './RepoLog'
import { RepoTree } from './RepoTree'

type RepoWorkspaceProps = {
  initialTree?: RepoTreeResponse
  isActive: boolean
  repo: Repo
}

export function RepoWorkspace({ initialTree, isActive, repo }: RepoWorkspaceProps) {
  return (
    <div className="grid min-h-0 items-stretch overflow-hidden rounded border border-ctp-surface-1 bg-ctp-mantle lg:grid-cols-[2fr_1fr]">
      <div className="order-2 min-w-0 border-t border-ctp-surface-1 lg:order-1 lg:border-r lg:border-t-0">
        <RepoTree isActive={isActive} repo={repo} initialTree={initialTree} />
      </div>
      <div className="order-1 min-w-0 lg:order-2">
        <RepoLog isActive={isActive} repo={repo} branch={initialTree?.ref} />
      </div>
    </div>
  )
}
