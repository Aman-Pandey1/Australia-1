import { useEffect, useState } from 'react'
import api from '../../lib/api'
import AdminLayout from './AdminLayout'

export default function AdminReports() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

    async function refresh() {
        setLoading(true)
        try {
            const { data } = await api.get('/admin/reports')
            setItems(data.reports || [])
        } finally { setLoading(false) }
    }

    useEffect(() => { refresh() }, [])

    async function setStatusFor(id, s) {
        await api.patch(`/admin/reports/${id}/status`, { status: s })
        refresh()
    }

    return (
        <AdminLayout title="Reports">
            <div className="d-flex align-items-center mb-3">
                <button className="btn btn-primary ms-auto" disabled={loading} onClick={refresh}>{loading?'Loading...':'Refresh'}</button>
            </div>
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead><tr><th>Listing</th><th>Reason</th><th>Status</th><th></th></tr></thead>
                            <tbody>
                                {items.map(r => (
                                    <tr key={r._id}>
                                        <td>{r.listing}</td>
                                        <td className="text-truncate" style={{ maxWidth: 480 }}>{r.reason}</td>
                                        <td><span className="badge text-bg-warning">{r.status}</span></td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={()=>setStatusFor(r._id, 'dismissed')}>Dismiss</button>
                                            <button className="btn btn-sm btn-success" onClick={()=>setStatusFor(r._id, 'resolved')}>Resolve</button>
                                        </td>
                                    </tr>
                                ))}
                                {!items.length && <tr><td colSpan={4} className="text-muted">No reports</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

