import { safeParse } from '@atcute/lexicons'
import { mainSchema as repoSchema } from '@atcute/tangled/types/repo'
import { mainSchema as issueSchema } from '@atcute/tangled/types/repo/issue'
import { mainSchema as pullSchema } from '@atcute/tangled/types/repo/pull'
import type { Issue, IssueRecord, Pull, PullRecord, Repo, TangledRecord } from './types'

export function validateRepo(record: TangledRecord<unknown>): Repo {
  const validation = safeParse(repoSchema, normalizeRepoRecord(record.value))
  if (!validation.ok) {
    throw new Error(`Bobbin returned an invalid repo record: ${record.uri}: ${validation.message}`)
  }

  return { ...record, value: validation.value }
}

export function validateIssueRecord(record: TangledRecord<unknown>): IssueRecord {
  const validation = safeParse(issueSchema, record.value)
  if (!validation.ok) {
    throw new Error(`Bobbin returned an invalid issue record: ${record.uri}: ${validation.message}`)
  }

  return { ...record, value: validation.value }
}

export function validateIssue(item: Omit<Issue, 'value'> & TangledRecord<unknown>): Issue {
  return { ...item, value: validateIssueRecord(item).value }
}

export function validatePullRecord(record: TangledRecord<unknown>): PullRecord {
  const validation = safeParse(pullSchema, record.value)
  if (!validation.ok) {
    throw new Error(`Bobbin returned an invalid pull record: ${record.uri}: ${validation.message}`)
  }

  return { ...record, value: validation.value }
}

export function validatePull(item: Omit<Pull, 'value'> & TangledRecord<unknown>): Pull {
  return { ...item, value: validatePullRecord(item).value }
}

function normalizeRepoRecord(value: unknown): unknown {
  if (!isRecord(value)) return value

  const normalized = { ...value }
  if (typeof normalized.description === 'string') {
    const graphemes = Array.from(
      new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(normalized.description),
      ({ segment }) => segment,
    )

    if (graphemes.length === 0) {
      delete normalized.description
    } else if (graphemes.length > 140) {
      normalized.description = graphemes.slice(0, 140).join('')
    }
  }

  return normalized
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
