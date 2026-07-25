import type { Handle } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { getRepoName, type Repo } from '../../lib/tangled'

type RepoCloneUrlProps = {
    handle: Handle
    repo: Repo
}

export function RepoCloneUrl({ handle, repo }: RepoCloneUrlProps) {
    const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
    const cloneUrl = buildCloneUri(handle, repo)

    async function copyCloneUrl() {
        try {
            await navigator.clipboard.writeText(cloneUrl)
            setStatus('copied')
        } catch {
            setStatus('failed')
        }
    }

    useEffect(() => {
        if (status !== 'copied') return

        const timeoutId = window.setTimeout(() => {
            setStatus('idle')
        }, 2000)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [status])

    return (
        <div className="mt-4 flex items-center gap-3 font-mono text-sm">
            <span className="shrink-0 text-ctp-overlay-1">Clone</span>
            <code className="min-w-0 truncate text-ctp-subtext-0" title={cloneUrl}>
                {cloneUrl}
            </code>
            <button
                type="button"
                onClick={copyCloneUrl}
                className="shrink-0 text-ctp-lavender hover:text-ctp-text"
            >
                {status === 'copied' ? 'Copied' : status === 'failed' ? 'Failed' : 'Copy'}
            </button>
        </div>
    )
}

function buildCloneUri(handle: Handle, repo: Repo) {
    const name = getRepoName(repo)
    return `git@tangled.org:${handle}/${name}.git`
}
