import type { Handle } from '@atcute/lexicons'
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconClipboard,
  IconClipboardX,
  IconTerminal2,
  IconWorld,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { useEffect, useId, useState } from 'react'
import { getRepoName, type Repo } from '../../lib/tangled'

type CloneProtocol = 'ssh' | 'https'

type RepoCloneUrlProps = {
  handle: Handle
  repo: Repo
}

export function RepoCloneUrl({ handle, repo }: RepoCloneUrlProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [protocol, setProtocol] = useState<CloneProtocol>('ssh')
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const panelId = useId()

  const cloneUrl = buildCloneUrl(handle, repo, protocol)

  async function copyCloneUrl() {
    try {
      await navigator.clipboard.writeText(cloneUrl)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  useEffect(() => {
    if (status === 'idle') return

    const timeoutId = window.setTimeout(() => {
      setStatus('idle')
    }, 2000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [status])

  return (
    <div className="mt-4 border-t border-ctp-surface-0 pt-4">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex items-center gap-2 text-sm font-medium text-ctp-lavender hover:text-ctp-text"
      >
        {isOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        <span>Clone</span>
      </button>

      {isOpen && (
        <div id={panelId} className="mt-3 flex flex-wrap items-stretch gap-2">
          <div
            role="group"
            aria-label="Clone protocol"
            className="inline-flex shrink-0 rounded-md border border-ctp-surface-1 p-1"
          >
            <ProtocolOption
              protocol="ssh"
              isActive={protocol === 'ssh'}
              onSelect={() => {
                setProtocol('ssh')
                setStatus('idle')
              }}
              icon={<IconTerminal2 size={14} />}
            />
            <ProtocolOption
              protocol="https"
              isActive={protocol === 'https'}
              onSelect={() => {
                setProtocol('https')
                setStatus('idle')
              }}
              icon={<IconWorld size={14} />}
            />
          </div>

          <div className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-md border border-ctp-surface-1 bg-ctp-crust">
            <input
              readOnly
              value={cloneUrl}
              aria-label="Clone URL"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm text-ctp-subtext-0 outline-none"
            />
            <button
              type="button"
              onClick={copyCloneUrl}
              aria-label={
                status === 'copied'
                  ? 'Copied'
                  : status === 'failed'
                    ? 'Failed to copy'
                    : 'Copy to clipboard'
              }
              className="flex items-center justify-center border-l border-ctp-surface-1 bg-ctp-mantle px-3 text-ctp-lavender transition-colors hover:bg-ctp-surface-0 hover:text-ctp-text"
            >
              <CopyIcon status={status} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

type ProtocolOptionProps = {
  protocol: CloneProtocol
  isActive: boolean
  onSelect: () => void
  icon: ReactNode
}

function ProtocolOption({ protocol, isActive, onSelect, icon }: ProtocolOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onSelect}
      className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
        isActive ? 'bg-ctp-surface-1 text-ctp-text' : 'text-ctp-overlay-1 hover:text-ctp-subtext-0'
      }`}
    >
      {icon}
      <span className="uppercase">{protocol}</span>
    </button>
  )
}

type CopyIconProps = {
  status: 'idle' | 'copied' | 'failed'
}

function CopyIcon({ status }: CopyIconProps) {
  if (status === 'copied') return <IconCheck size={18} className="text-ctp-green" />
  if (status === 'failed') return <IconClipboardX size={18} className="text-ctp-red" />
  return <IconClipboard size={18} />
}

function buildCloneUrl(handle: Handle, repo: Repo, protocol: CloneProtocol) {
  const name = getRepoName(repo)
  if (protocol === 'https') {
    return `https://tangled.org/${handle}/${name}.git`
  }
  return `git@tangled.org:${handle}/${name}.git`
}
