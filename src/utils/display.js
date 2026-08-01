export function getInitials(name) {
  if (!name) return '?'
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  const initials = parts.slice(0, 2).map((part) => part[0])
  return initials.join('').toUpperCase() || '?'
}
