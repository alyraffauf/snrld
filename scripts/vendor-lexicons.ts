import { readdir, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import lock from '../lexicons.lock.json'
const checkout = process.argv[2]
if (!checkout) throw new Error('Usage: bun scripts/vendor-lexicons.ts /path/to/tangled-core')
const commit = execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim()
if (commit !== lock.commit) throw new Error(`Expected core ${lock.commit}, received ${commit}`)
const schemas = new Map<string, string>()
for (const file of await readdir(join(checkout, 'lexicons'), { recursive: true })) {
  if (!file.endsWith('.json')) continue
  const content = await readFile(join(checkout, 'lexicons', file), 'utf8')
  const schema = JSON.parse(content)
  if (schema.id) schemas.set(schema.id, content)
}
const selected = new Map<string, string>()
function include(id: string) {
  if (selected.has(id)) return
  const content = schemas.get(id)
  if (!content) throw new Error(`Missing lexicon ${id}`)
  selected.set(id, content)
  for (const match of content.matchAll(/"(org\.tangled\.[^"#]+)(?:#[^"]*)?"/g)) {
    if (schemas.has(match[1])) include(match[1])
  }
}
for (const id of lock.roots) include(id)
await rm('lexicons', { recursive: true, force: true })
await mkdir('lexicons')
for (const [id, content] of selected)
  await writeFile(`lexicons/${id}.json`, JSON.stringify(JSON.parse(content), null, 2) + '\n')
console.log(`Vendored ${selected.size} lexicons from ${commit}`)
