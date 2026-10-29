import { parseResourceUri, safeParse, type Did } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { mainSchema as repoSchema } from '../lexicons/types/org/tangled/repo/manifest'
import { mainSchema as ticketSchema } from '../lexicons/types/org/tangled/track/ticket'
import type { Repo, Issue, TangledRecord } from './types'

export function validateRepo(
  record: TangledRecord<unknown> & { knot?: string; git?: Repo['git'] },
): Repo {
  const validation = safeParse(repoSchema, record.value)
  const identity = parseResourceUri(record.uri)
  if (
    !validation.ok ||
    identity.collection !== 'org.tangled.repo.manifest' ||
    identity.rkey !== 'self' ||
    !isDid(identity.repo)
  ) {
    throw new Error(`Invalid repository manifest: ${record.uri}`)
  }
  const value = validation.value
  return {
    uri: record.uri,
    manifestUri: record.uri,
    cid: record.cid,
    repoDid: identity.repo,
    ownerDid: value.declaration.owner,
    name: value.declaration.name,
    declarationUri: `at://${value.declaration.owner}/org.tangled.repo.declaration/${value.declaration.name.toLowerCase()}`,
    knot: record.knot,
    git: record.git,
    spindle: value.spindle,
    description: value.description,
    website: value.website,
    topics: value.topics,
    createdAt: value.createdAt,
  }
}

export function validateIssue(
  item: TangledRecord<unknown> & { author?: string; state?: string; commentCount?: number },
): Issue {
  const value = normalizeTicketTitle(item.value)
  const validation = safeParse(ticketSchema, value)
  if (!validation.ok || !item.author || !isDid(item.author))
    throw new Error(`Invalid ticket: ${item.uri}`)
  const ticket = validation.value
  return {
    ...item,
    author: item.author as Did,
    state: item.state ?? ticket.state,
    commentCount: item.commentCount ?? 0,
    value: {
      ...ticket,
      title: ticket.title.text,
      body: ticket.body?.text,
      markup: { title: ticket.title, body: ticket.body },
    },
  }
}
export function validatePull(item: Parameters<typeof validateIssue>[0]): Issue {
  const ticket = validateIssue(item)
  return { ...ticket, state: ticket.state === 'completed' ? 'merged' : ticket.state }
}

export function normalizeTicketTitle(value: unknown): unknown {
  if (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    typeof value.title === 'string'
  ) {
    value = { ...value, title: { $type: 'org.tangled.markup.markdown#inline', text: value.title } }
  }
  return value
}
