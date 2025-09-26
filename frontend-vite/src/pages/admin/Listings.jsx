import { useEffect, useMemo, useState } from 'react'
import api from '../../lib/api'
import AdminLayout from './AdminLayout'

function TierBadge({ level }) {
    const map = { none: { t: 'Free', c: 'text-bg-secondary' }, featured: { t: 'Featured', c: 'text-bg-info' }, premium: { t: 'Premium', c: 'text-bg-primary' }, vip: { t: 'Diamond', c: 'text-bg-warning' } }
    const cur = map[level] || map.none
    return <span className={`badge ${cur.c}`}>{cur.t}</span>
}

function TierEditor({ listing, onSaved }) {
    const [level, setLevel] = useState(listing?.premium?.level || 'none')
    const [cities, setCities] = useState((listing?.premium?.cities || []).join(', '))
    const [saving, setSaving] = useState(false)
    async function save() {
        setSaving(true)
        const payload = { status: listing.status, premium: { level } }
        if (level === 'featured' || level === 'premium') {
            const arr = cities.split(',').map(s=>s.trim()).filter(Boolean)
            if (arr.length) payload.premium.cities = arr
        }
        if (level === 'vip') payload.premium.showOnHomepage = true
        await api.patch(`/admin/listings/${listing._id}/status`, payload)
        setSaving(false)
        onSaved?.()
    }
    return (
        <div className="d-flex gap-2 align-items-center justify-content-end">
            <select className="form-select form-select-sm w-auto" value={level} onChange={(e)=>setLevel(e.target.value)}>
                <option value="none">Free</option>
                <option value="featured">Featured (city)</option>
                <option value="premium">Premium (multi-city)</option>
                <option value="vip">Diamond (VIP)</option>
            </select>
            {(level==='featured' || level==='premium') && (
                <input className="form-control form-control-sm" style={{ maxWidth: 260 }} placeholder="Cities (comma separated)" value={cities} onChange={(e)=>setCities(e.target.value)} />
            )}
            <button className="btn btn-sm btn-primary" disabled={saving} onClick={save}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
    )
}

export default function AdminListings() {
    const [items, setItems] = useState([])
    const [status, setStatus] = useState('')
    const [city, setCity] = useState('')
    const [loading, setLoading] = useState(false)

    async function refresh() {
        setLoading(true)
        try {
            const params = {}
            if (status) params.status = status
            if (city) params.city = city
            const { data } = await api.get('/admin/listings', { params })
            setItems(data.listings || [])
        } finally { setLoading(false) }
    }

    useEffect(() => { refresh() }, [])

    const cities = useMemo(() => Array.from(new Set(items.map(i => i.contact?.city).filter(Boolean))).sort(), [items])

    return (
        <AdminLayout title="Listings">
            <div className="row g-2 align-items-end mb-3">
                <div className="col-md-3">
                    <label className="form-label small">Status</label>
                    <select className="form-select" value={status} onChange={(e)=>setStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label small">City</label>
                    <input className="form-control" list="admin-listing-cities" value={city} onChange={(e)=>setCity(e.target.value)} />
                    <datalist id="admin-listing-cities">
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </datalist>
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary mt-4" disabled={loading} onClick={refresh}>{loading?'Loading...':'Filter'}</button>
                </div>
            </div>
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead><tr><th>Title</th><th>City</th><th>Status</th><th>Tier</th><th></th></tr></thead>
                            <tbody>
                                {items.map(l => (
                                    <tr key={l._id}>
                                        <td className="fw-semibold">{l.title}</td>
                                        <td className="text-muted small">{l.contact?.city || '-'}</td>
                                        <td>
                                            <span className={`badge ${l.status==='approved'?'text-bg-success':(l.status==='pending'?'text-bg-warning':'text-bg-secondary')}`}>{l.status}</span>
                                        </td>
                                        <td><TierBadge level={l?.premium?.level || 'none'} /></td>
                                        <td className="text-end"><TierEditor listing={l} onSaved={refresh} /></td>
                                    </tr>
                                ))}
                                {!items.length && <tr><td colSpan={5} className="text-muted">No listings</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

