export function isDirectoryMode(mode: string): boolean {
  const normalizedMode = mode.toLowerCase()

  return (
    normalizedMode === 'tree' ||
    normalizedMode === 'dir' ||
    normalizedMode === 'directory' ||
    normalizedMode === '40000' ||
    normalizedMode === '040000' ||
    normalizedMode.endsWith('40000')
  )
}
