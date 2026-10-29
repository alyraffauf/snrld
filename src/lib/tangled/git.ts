import { ok } from './response'
import { safeParse, type Did } from '@atcute/lexicons'
import { rpc, BOBBIN_URL } from './client'
import { mainSchema as treeSchema } from './lexicons/types/org/tangled/temp/git/getTree'
import { mainSchema as commitsSchema } from './lexicons/types/org/tangled/temp/git/listCommitsByRef'
import type { TreeEntry } from './lexicons/types/org/tangled/temp/git/getTree'
export type RepoTree = {
  files: TreeEntry[]
  ref: string
  readme?: { filename: string; contents: string }
}
export function gitBlobUrl(repo: Did, ref: string, path: string) {
  const url = new URL('/xrpc/org.tangled.temp.git.getBlob', BOBBIN_URL)
  url.search = new URLSearchParams({ repo, ref, path }).toString()
  return url.toString()
}
export async function getTree(repo: Did, ref: string, path: string): Promise<RepoTree> {
  const response = await ok(
    rpc.get('org.tangled.temp.git.getTree', { params: { repo, ref, path } }),
  )
  const parsed = safeParse(treeSchema.output.schema, response)
  if (!parsed.ok) throw new Error(`Invalid repository tree: ${parsed.message}`)
  const result: RepoTree = { files: parsed.value.entries, ref }
  const readme = result.files.find(
    (entry) => /^readme(?:\.[^.]+)?$/i.test(entry.name) && entry.mode.startsWith('010'),
  )
  if (readme && readme.size <= 1_000_000) {
    try {
      const blob = await ok(
        rpc.get('org.tangled.temp.git.getBlob', {
          as: 'blob',
          params: { repo, ref, path: [path, readme.name].filter(Boolean).join('/') },
        }),
      )
      if (blob.size <= 1_000_000)
        result.readme = { filename: readme.name, contents: await blob.text() }
    } catch {
      /* The tree remains useful when a README cannot be fetched. */
    }
  }
  return result
}
export async function listCommits(repo: Did, ref: string, limit = 50, skip = 0) {
  const response = await ok(
    rpc.get('org.tangled.temp.git.listCommitsByRef', {
      params: { repo, ranges: [ref], limit, skip },
    }),
  )
  const parsed = safeParse(commitsSchema.output.schema, response)
  if (!parsed.ok) throw new Error(`Invalid commit list: ${parsed.message}`)
  return parsed.value.commits
}
export async function formatPatch(repo: Did, from: string, to: string) {
  const blob = await ok(
    rpc.get('org.tangled.temp.git.formatPatch', { as: 'blob', params: { repo, from, to } }),
  )
  return blob.text()
}
