import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Dashboard() {
    const [subs, setSubs] = useState({ subscription: null, remainingDays: 0 })
    const [listings, setListings] = useState([])
    const [newListing, setNewListing] = useState({ title: '', description: '', price: '', contact: { city: '', address: '', phone: '' }, stats: { age: '' } })
    const [ad, setAd] = useState({ listingId: '', type: 'city', cities: '', priceUsd: 10 })

    async function refresh() {
        try {
            const [{ data: subData }, { data: myData }] = await Promise.all([
                api.get('/subscriptions/me'),
                api.get('/listings/me'),
            ])
            setSubs(subData)
            setListings(myData.listings || [])
        } catch {}
    }

    useEffect(() => { refresh() }, [])

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 m-0">My Dashboard</h1>
                <div className="small text-secondary">Welcome back</div>
            </div>
            <div className="row g-3">
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="fw-semibold mb-1">Subscription</div>
                            <div className="text-muted small">Remaining days: {subs.remainingDays}</div>
                            <div className="mt-3 d-flex gap-2">
                                <button className="btn btn-outline-secondary btn-sm" onClick={async () => { await api.post('/subscriptions/recharge', { months: 1 }); refresh() }}>1 month</button>
                                <button className="btn btn-outline-secondary btn-sm" onClick={async () => { await api.post('/subscriptions/recharge', { months: 3 }); refresh() }}>3 months</button>
                                <button className="btn btn-primary btn-sm" onClick={async () => { await api.post('/subscriptions/recharge', { months: 12 }); refresh() }}>12 months</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="fw-semibold mb-2">Add Listing</div>
                            <div className="mb-2">
                                <label className="form-label">Title</label>
                                <input className="form-control" value={newListing.title} onChange={(e)=>setNewListing({ ...newListing, title: e.target.value })} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">City</label>
                                <input className="form-control" value={newListing.contact.city} onChange={(e)=>setNewListing({ ...newListing, contact: { ...newListing.contact, city: e.target.value } })} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Address</label>
                                <input className="form-control" placeholder="Private | CBD" value={newListing.contact.address} onChange={(e)=>setNewListing({ ...newListing, contact: { ...newListing.contact, address: e.target.value } })} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Phone</label>
                                <input className="form-control" placeholder="04XX XXX XXX" value={newListing.contact.phone} onChange={(e)=>setNewListing({ ...newListing, contact: { ...newListing.contact, phone: e.target.value } })} />
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <label className="form-label">Age</label>
                                    <input className="form-control" type="number" min="18" max="70" value={newListing.stats.age} onChange={(e)=>setNewListing({ ...newListing, stats: { ...newListing.stats, age: e.target.value ? Number(e.target.value) : '' } })} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Price per hour (AUD)</label>
                                    <input className="form-control" type="number" min="0" step="10" value={newListing.price} onChange={(e)=>setNewListing({ ...newListing, price: e.target.value ? Number(e.target.value) : '' })} />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows={3} value={newListing.description} onChange={(e)=>setNewListing({ ...newListing, description: e.target.value })} />
                            </div>
                            <button className="btn btn-success btn-sm" onClick={async ()=>{
                                if(!newListing.title) return
                                const payload = { ...newListing }
                                if (payload.price === '') delete payload.price
                                if (payload.stats && payload.stats.age === '') delete payload.stats.age
                                await api.post('/listings', payload)
                                setNewListing({ title: '', description: '', price: '', contact: { city: '', address: '', phone: '' }, stats: { age: '' } })
                                refresh()
                            }}>Submit for approval</button>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="fw-semibold mb-2">My Listings</div>
                            <div className="row g-3">
                                {listings.map(it => (
                                    <div className="col-md-4" key={it._id}>
                                        <div className="border rounded p-3 h-100">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <div className="fw-semibold">{it.title}</div>
                                                <span className={`badge ${it.status==='approved'?'text-bg-success':(it.status==='pending'?'text-bg-warning':'text-bg-secondary')}`}>{it.status}</span>
                                            </div>
                                            <div className="text-muted small">{it.stats?.age ? `${it.stats.age} yrs` : 'Age private'} • {it.contact?.city || '-'} • {it.contact?.address || 'Private'}</div>
                                            <div className="text-muted small">{it.contact?.phone || '—'} {it.price ? `• $${it.price}/hr` : ''}</div>
                                        </div>
                                    </div>
                                ))}
                                {!listings.length && <div className="text-muted">No listings yet.</div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="fw-semibold mb-2">Purchase Advertising</div>
                            <div className="row g-2 align-items-end">
                                <div className="col-md-3">
                                    <label className="form-label">Listing</label>
                                    <select className="form-select" value={ad.listingId} onChange={(e)=>setAd({ ...ad, listingId: e.target.value })}>
                                        <option value="">Select listing</option>
                                        {listings.map(l => <option key={l._id} value={l._id}>{l.title}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Type</label>
                                    <select className="form-select" value={ad.type} onChange={(e)=>{
                                        const type = e.target.value
                                        setAd({ ...ad, type, priceUsd: type==='homepage'?30:(type==='multi_city'?20:10) })
                                    }}>
                                        <option value="city">City ($10)</option>
                                        <option value="multi_city">Multi-city ($20)</option>
                                        <option value="homepage">Homepage ($30)</option>
                                    </select>
                                </div>
                                {(ad.type==='city' || ad.type==='multi_city') && (
                                    <div className="col-md-4">
                                        <label className="form-label">Cities (comma separated)</label>
                                        <input className="form-control" placeholder="Sydney, Melbourne" value={ad.cities} onChange={(e)=>setAd({ ...ad, cities: e.target.value })} />
                                    </div>
                                )}
                                <div className="col-md-2">
                                    <div className="text-muted small mb-1">Price (USD)</div>
                                    <div className="h5 m-0">${ad.priceUsd}</div>
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-primary" onClick={async ()=>{
                                        if(!ad.listingId) return
                                        const payload = { listingId: ad.listingId, type: ad.type, priceUsd: ad.priceUsd }
                                        if(ad.cities) payload.cities = ad.cities.split(',').map(s=>s.trim()).filter(Boolean)
                                        await api.post('/ads', payload)
                                        alert('Ad purchase submitted. Pending approval.')
                                    }}>Purchase</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

