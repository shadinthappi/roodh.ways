export const apiVersion = (() => {
  const raw = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-18'
  const cleaned = raw.replace(/['"]/g, '').trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(cleaned) || cleaned === '1' ? cleaned : '2026-05-18'
})()

export const dataset = (() => {
  const raw = assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
  )
  return raw.replace(/['"]/g, '').trim()
})()

export const projectId = (() => {
  const raw = assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
  )
  return raw.replace(/['"]/g, '').trim()
})()

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined || v === '') {
    throw new Error(errorMessage)
  }

  return v
}

