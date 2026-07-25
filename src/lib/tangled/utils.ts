export function removeNullCursor(value: unknown): unknown {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value
  }

  const { cursor, ...rest } = value as Record<string, unknown>
  return cursor === null ? rest : value
}
