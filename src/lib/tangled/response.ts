import { ClientResponseError } from '@atcute/client'
import { safeParse, type InferInput, type BaseSchema } from '@atcute/lexicons/validations'

export class TangledError extends Error {
  readonly kind: 'not-found' | 'unavailable' | 'invalid-response' | 'request'
  constructor(kind: TangledError['kind'], message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'TangledError'
    this.kind = kind
  }
}

export async function ok<T>(
  request: Promise<
    | { ok: true; data: T }
    | { ok: false; status: number; data: { error: string; message?: string }; headers: Headers }
  >,
): Promise<T> {
  try {
    const response = await request
    if (!response.ok) throw new ClientResponseError(response)
    return response.data
  } catch (error) {
    if (error instanceof ClientResponseError) {
      const kind =
        error.status === 404
          ? 'not-found'
          : error.status >= 500 || error.status === 429
            ? 'unavailable'
            : 'request'
      throw new TangledError(
        kind,
        `${error.error}: ${error.description ?? `HTTP ${error.status}`}`,
        { cause: error },
      )
    }
    throw error
  }
}

export function validate<T extends BaseSchema>(schema: T, value: unknown): InferInput<T> {
  const result = safeParse(schema, value)
  if (!result.ok) throw new TangledError('invalid-response', result.message)
  return result.value
}
