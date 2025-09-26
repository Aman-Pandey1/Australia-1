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
    const [createMode, setCreateMode] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [payload, setPayload] = useState({ owner: '', title: '', description: '', contact: { city: '' }, price: '', stats: { age: '' } })
    const [images, setImages] = useState([])

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

    useEffect(() => { refresh(); (async()=>{ try{ const { data } = await api.get('/admin/users'); setAllUsers(data.users||[]) }catch{} })() }, [])

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
            <div className="mt-3 d-flex justify-content-end">
                <button className="btn btn-success" onClick={()=>setCreateMode(true)}>Create listing</button>
            </div>

            {createMode && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header"><div className="modal-title">Create listing</div><button className="btn-close" onClick={()=>setCreateMode(false)}></button></div>
                            <div className="modal-body">
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Owner</label>
                                        <select className="form-select" value={payload.owner} onChange={(e)=>setPayload({ ...payload, owner: e.target.value })}>
                                            <option value="">Select user</option>
                                            {allUsers.map(u => <option key={u._id} value={u._id}>{u.email}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Title</label>
                                        <input className="form-control" value={payload.title} onChange={(e)=>setPayload({ ...payload, title: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">City</label>
                                        <input className="form-control" value={payload.contact.city} onChange={(e)=>setPayload({ ...payload, contact: { ...payload.contact, city: e.target.value } })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Price</label>
                                        <input className="form-control" type="number" value={payload.price} onChange={(e)=>setPayload({ ...payload, price: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-control" rows={3} value={payload.description} onChange={(e)=>setPayload({ ...payload, description: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Photos</label>
                                        <input className="form-control" type="file" multiple accept="image/*" onChange={(e)=>setImages(Array.from(e.target.files||[]))} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={()=>setCreateMode(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={async()=>{
                                    if(!payload.title || !payload.owner) return
                                    const form = new FormData()
                                    form.append('title', payload.title)
                                    form.append('description', payload.description)
                                    form.append('owner', payload.owner)
                                    form.append('contact', JSON.stringify(payload.contact))
                                    if (payload.price) form.append('price', String(payload.price))
                                    images.forEach(f => form.append('images', f))
                                    await api.post('/listings', form, { headers: { 'Content-Type': 'multipart/form-data' } })
                                    setCreateMode(false); setPayload({ owner: '', title: '', description: '', contact: { city: '' }, price: '', stats: { age: '' } }); setImages([]); refresh()
                                }}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

