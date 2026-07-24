import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import type { Repo } from '../lib/tangled'
import { RepoLog } from './RepoLog'
import { RepoTree } from './RepoTree'

type RepoWorkspaceProps = {
  repo: Repo
  onRootTree?: (tree: RepoTreeResponse) => void
}

export function RepoWorkspace({ repo, onRootTree }: RepoWorkspaceProps) {
  return (
    <div className="grid items-stretch overflow-hidden rounded border border-ctp-surface-1 bg-ctp-mantle lg:grid-cols-2">
      <div className="order-2 min-w-0 border-t border-ctp-surface-1 lg:order-1 lg:border-r lg:border-t-0">
        <RepoTree repo={repo} onRootTree={onRootTree} />
      </div>
      <div className="order-1 min-w-0 lg:order-2">
        <RepoLog repo={repo} />
      </div>
    </div>
  )
}
