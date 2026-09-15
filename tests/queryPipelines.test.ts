import { afterAll, afterEach, expect, spyOn, test } from 'bun:test'
import type { Main as Pipeline } from '@atcute/tangled/types/ci/pipeline'
import { queryPipelines } from '../src/lib/tangled/pipeline/queryPipelines'

const repo = 'did:plc:j5hmlfdrwkvtxm7cjmu7j2is'
const pipeline: Pipeline = {
  id: '3mvlav5uec222',
  repo,
  commit: '463355f7b91d9474726fa1f68c379595e0c9d37f',
  trigger: {
    $type: 'sh.tangled.ci.trigger#push',
    ref: 'refs/heads/main',
    newSha: '463355f7b91d9474726fa1f68c379595e0c9d37f',
    oldSha: '3ddc505b1a3cf68f3f62f48f10c8660d0ac13739',
  },
  workflows: [{ id: 'build.yml', name: 'build.yml', status: 'success' }],
}

const fetchMock = spyOn(globalThis, 'fetch')

afterEach(() => fetchMock.mockReset())
afterAll(() => fetchMock.mockRestore())

test('accepts a legacy null pipeline list and null cursor', async () => {
  fetchMock.mockResolvedValue(Response.json({ pipelines: null, cursor: null, total: 0 }))

  expect(await queryPipelines('spindle.tangled.sh', repo)).toEqual({
    items: [],
    cursor: undefined,
  })
})

test('accepts a null list after the last page of a nonempty repository', async () => {
  fetchMock.mockResolvedValue(Response.json({ pipelines: null, total: 10 }))

  expect(await queryPipelines('spindle.tangled.sh', repo, { cursor: '1' })).toEqual({
    items: [],
    cursor: undefined,
  })
})

test('accepts the current empty array response', async () => {
  fetchMock.mockResolvedValue(Response.json({ pipelines: [], total: 0 }))

  expect(await queryPipelines('spindle.tangled.sh', repo)).toEqual({
    items: [],
    cursor: undefined,
  })
})

test('preserves pipeline details and requests the next page', async () => {
  fetchMock.mockResolvedValue(
    Response.json({ pipelines: [pipeline], cursor: '38057', total: 5715 }),
  )

  expect(await queryPipelines('spindle.tangled.sh', repo, { cursor: '38058', limit: 20 })).toEqual({
    items: [pipeline],
    cursor: '38057',
  })

  const url = new URL(String(fetchMock.mock.calls[0][0]))
  expect(url.origin).toBe('https://spindle.tangled.sh')
  expect(url.pathname).toBe('/xrpc/sh.tangled.ci.queryPipelines')
  expect(Object.fromEntries(url.searchParams)).toEqual({ repo, cursor: '38058', limit: '20' })
})

test.each([
  { total: 0 },
  { pipelines: {}, total: 0 },
  { pipelines: '', total: 0 },
  { pipelines: [null], total: 1 },
  { pipelines: [{ ...pipeline, workflows: null }], total: 1 },
  { pipelines: null, total: '0' },
  null,
])('rejects malformed responses: %j', async (response) => {
  fetchMock.mockResolvedValue(Response.json(response))

  await expect(queryPipelines('spindle.tangled.sh', repo)).rejects.toThrow(
    'Spindle returned invalid pipelines:',
  )
})
