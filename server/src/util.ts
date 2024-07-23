export function camelToSnakeCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

export function currentDayInUnixTime() {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  return date.getTime() / 1000
}
