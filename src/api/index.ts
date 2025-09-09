function next22Minutedate(minutesForRollover: number) {
  const dt = new Date()
  dt.setMinutes(minutesForRollover)
  if (dt < new Date()) {
    dt.setHours(dt.getHours() + 1)
  }
  return dt
}

export function revalidate(minutesForRollover = 22) {
  const current = Date.now()
  const secondsTillRevalidation = Math.ceil((next22Minutedate(minutesForRollover).getTime() - current) / 1000)
  return secondsTillRevalidation > 0 ? secondsTillRevalidation : 3600
}
