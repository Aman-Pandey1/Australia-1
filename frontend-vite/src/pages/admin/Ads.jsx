import { useEffect, useState } from 'react'
import api from '../../lib/api'
import AdminLayout from './AdminLayout'

export default function AdminAds() {
    const [items, setItems] = useState([])
    const [status, setStatus] = useState('pending')
    const [loading, setLoading] = useState(false)

    async function refresh() {
        setLoading(true)
        try {
            const { data } = await api.get('/admin/ads')
            let ads = data.ads || []
            if (status) ads = ads.filter(a => a.status === status)
            setItems(ads)
        } finally { setLoading(false) }
    }

    useEffect(() => { refresh() }, [status])

    async function setStatusFor(id, newStatus) {
        await api.patch(`/admin/ads/${id}/status`, { status: newStatus })
        refresh()
    }

    return (
        <AdminLayout title="Ads">
            <div className="d-flex align-items-end gap-2 mb-3">
                <div>
                    <label className="form-label small">Status</label>
                    <select className="form-select" value={status} onChange={(e)=>setStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <button className="btn btn-primary mt-4" disabled={loading} onClick={refresh}>{loading?'Loading...':'Refresh'}</button>
            </div>
            <div className="row g-2">
                {items.map(a => (
                    <div className="col-md-6" key={a._id}>
                        <div className="border rounded p-3 d-flex justify-content-between align-items-center">
                            <div>
                                <div className="fw-semibold">{a.listing?.title || a.listing}</div>
                                <div className="text-muted small">{a.type} • ${a.priceUsd}</div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-outline-danger" onClick={()=>setStatusFor(a._id, 'rejected')}>Reject</button>
                                <button className="btn btn-sm btn-success" onClick={()=>setStatusFor(a._id, 'approved')}>Approve</button>
                            </div>
                        </div>
                    </div>
                ))}
                {!items.length && <div className="text-muted">No ads</div>}
            </div>
        </AdminLayout>
    )
}

