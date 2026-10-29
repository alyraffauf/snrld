import { validate } from '../response'
import { mainSchema } from '../lexicons/types/org/tangled/snippet/string'

export function validateString(value: unknown) {
  // Migrated text files can omit the union discriminator. Do not override explicit types.
  if (typeof value === 'object' && value !== null && 'snippet' in value) {
    const snippet = value.snippet
    if (typeof snippet === 'object' && snippet !== null && !('$type' in snippet)) {
      value = { ...value, snippet: { ...snippet, $type: 'org.tangled.snippet.string#textFile' } }
    }
  }
  return validate(mainSchema, value)
}
