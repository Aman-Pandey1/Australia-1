import { useEffect, useState } from 'react'
import api from '../../lib/api'
import AdminLayout from './AdminLayout'

export default function AdminReviews() {
    const [items, setItems] = useState([])
    const [status, setStatus] = useState('pending')
    const [loading, setLoading] = useState(false)

    async function refresh() {
        setLoading(true)
        try {
            const params = {}
            if (status) params.status = status
            const { data } = await api.get('/admin/reviews', { params })
            setItems(data.reviews || [])
        } finally { setLoading(false) }
    }

    useEffect(() => { refresh() }, [status])

    async function setStatusFor(id, s) {
        await api.patch(`/admin/reviews/${id}/status`, { status: s })
        refresh()
    }

    return (
        <AdminLayout title="Reviews">
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
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead><tr><th>Listing</th><th>Rating</th><th>Content</th><th>Status</th><th></th></tr></thead>
                            <tbody>
                                {items.map(r => (
                                    <tr key={r._id}>
                                        <td>{r.listing}</td>
                                        <td>{r.rating}</td>
                                        <td className="text-truncate" style={{ maxWidth: 360 }}>{r.content}</td>
                                        <td><span className={`badge ${r.status==='approved'?'text-bg-success':(r.status==='pending'?'text-bg-warning':'text-bg-secondary')}`}>{r.status}</span></td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-danger me-2" onClick={()=>setStatusFor(r._id, 'rejected')}>Reject</button>
                                            <button className="btn btn-sm btn-success" onClick={()=>setStatusFor(r._id, 'approved')}>Approve</button>
                                        </td>
                                    </tr>
                                ))}
                                {!items.length && <tr><td colSpan={5} className="text-muted">No reviews</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

