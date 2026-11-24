export function brToIso(br) {
  if (!br || !/^\d{2}\/\d{2}\/\d{4}$/.test(br)) return ''
  const [d, m, y] = br.split('/')
  return `${y}-${m}-${d}`
}

export function isoToBr(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
