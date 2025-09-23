/* Seed listings via the running API so data appears in the live server's DB */
import dayjs from 'dayjs'

const BASE = process.env.API_BASE || 'http://localhost:4000/api'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456'

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  'https://images.unsplash.com/photo-1520975930461-d2e3b2b1e2e2',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1520975614850-1a4ddc1f14d1',
]
const CITIES = ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Canberra']
const CATEGORIES = ['Escort','Massage','Agency','Independent','GFE','BDSM']
const GENDERS = ['female','male','trans']

function pick(arr, n = 1) {
  const copy = [...arr]
  const result = []
  while (n-- > 0 && copy.length) {
    const idx = Math.floor(Math.random() * copy.length)
    result.push(copy.splice(idx, 1)[0])
  }
  return result
}

async function req(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${method} ${path} -> ${res.status}: ${text}`)
  }
  return res.json()
}

function premiumForIndex(i) {
  if (i % 7 === 0) return { level: 'vip', startsAt: new Date(), expiresAt: dayjs().add(60, 'day').toDate(), showOnHomepage: true }
  if (i % 3 === 0) return { level: 'premium', startsAt: new Date(), expiresAt: dayjs().add(30, 'day').toDate() }
  if (i % 2 === 0) return { level: 'featured', startsAt: new Date(), expiresAt: dayjs().add(14, 'day').toDate() }
  return { level: 'none' }
}

async function main() {
  // Login as admin
  const { token } = await req('/auth/login', { method: 'POST', body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } })

  const createdIds = []
  const total = Number(process.env.SEED_VIA_API_COUNT || 24)
  for (let i = 1; i <= total; i++) {
    const city = CITIES[i % CITIES.length]
    const gender = GENDERS[i % GENDERS.length]
    const categories = pick(CATEGORIES, 2)
    const title = `${city} ${gender} model #${i}`

    const { listing } = await req('/listings', {
      method: 'POST',
      token,
      body: {
        title,
        description: 'High quality service. Discreet and professional. Call now.',
        photos: pick(SAMPLE_PHOTOS, 2),
        categories,
        contact: { city, country: 'Australia' },
        stats: { gender, age: 20 + (i % 10) },
      },
    })

    // Set premium and some views
    const premium = premiumForIndex(i)
    await req(`/listings/${listing._id}`, {
      method: 'PUT',
      token,
      body: { premium, views: Math.floor(Math.random() * 5000) },
    })

    // Approve via admin route
    await req(`/admin/listings/${listing._id}/status`, {
      method: 'PATCH',
      token,
      body: { status: 'approved' },
    })

    createdIds.push(listing._id)
  }

  const data = await req('/listings/home/sections')
  const counts = {
    diamond: data.diamond?.length || 0,
    premium: data.premium?.length || 0,
    free: data.free?.length || 0,
    featured: data.featured?.length || 0,
    popular: data.popular?.length || 0,
    newly: data.newly?.length || 0,
  }
  // eslint-disable-next-line no-console
  console.log('Seeded via API:', createdIds.length, 'items. Sections counts:', counts)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

