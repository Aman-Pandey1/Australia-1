import { useEffect, useState } from 'react'
import api from '../../lib/api'
import AdminLayout from './AdminLayout'

export default function AdminSubscriptions() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

    async function refresh() {
        setLoading(true)
        try {
            const { data } = await api.get('/admin/subscriptions')
            setItems(data.subscriptions || [])
        } finally { setLoading(false) }
    }

    useEffect(() => { refresh() }, [])

    return (
        <AdminLayout title="Subscriptions">
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle mb-0">
                            <thead><tr><th>User</th><th>Plan</th><th>Started</th><th>Expires</th><th>Status</th></tr></thead>
                            <tbody>
                                {items.map(s => (
                                    <tr key={s._id}>
                                        <td>{s.user}</td>
                                        <td>{s.plan}</td>
                                        <td>{new Date(s.startedAt).toLocaleDateString()}</td>
                                        <td>{new Date(s.expiresAt).toLocaleDateString()}</td>
                                        <td><span className={`badge ${s.status==='active'?'text-bg-success':'text-bg-secondary'}`}>{s.status}</span></td>
                                    </tr>
                                ))}
                                {!items.length && <tr><td colSpan={5} className="text-muted">No subscriptions</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

