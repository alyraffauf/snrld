import { ok } from '@atcute/client'
import { safeParse } from '@atcute/lexicons'
import type { $output as DefaultBranch } from '@atcute/tangled/types/repo/getDefaultBranch'
import { mainSchema as defaultBranchSchema } from '@atcute/tangled/types/repo/getDefaultBranch'
import { rpc } from '../client'
import type { Repo } from './types'

export async function getDefaultBranch(repo: Repo): Promise<DefaultBranch> {
  const response = await ok(
    rpc.get('sh.tangled.repo.getDefaultBranch', {
      params: { repo: repo.uri },
    }),
  )

  const branchValidation = safeParse(defaultBranchSchema.output.schema, response)
  if (!branchValidation.ok) {
    throw new Error(`Bobbin returned an invalid default branch: ${branchValidation.message}`)
  }

  return branchValidation.value
}
