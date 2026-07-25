export type ProfileSection = 'overview' | 'repos' | 'strings' | 'stars' | 'vouches'

export function parseProfileSection(value: string | null): ProfileSection {
  if (value === 'repos' || value === 'strings' || value === 'stars' || value === 'vouches') {
    return value
  }

  return 'overview'
}
