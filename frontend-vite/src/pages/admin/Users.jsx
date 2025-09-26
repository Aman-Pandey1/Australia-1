import { useEffect, useMemo, useState } from 'react'
import api from '../../lib/api'
import AdminLayout from './AdminLayout'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [q, setQ] = useState('')
    const [loading, setLoading] = useState(false)

    async function refresh() {
        setLoading(true)
        try {
            const { data } = await api.get('/admin/users', { params: { q } })
            setUsers(data.users || [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { refresh() }, [])

    async function setRole(userId, role) {
        await api.patch(`/admin/users/${userId}/role`, { role })
        await refresh()
    }

    const countByRole = useMemo(() => users.reduce((acc, u) => { acc[u.role] = (acc[u.role]||0)+1; return acc }, {}), [users])

    return (
        <AdminLayout title="Users">
            <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
                <div>
                    <label className="form-label small">Search</label>
                    <input className="form-control" placeholder="Name or email" value={q} onChange={(e)=>setQ(e.target.value)} />
                </div>
                <div>
                    <button className="btn btn-primary mt-4" onClick={refresh} disabled={loading}>{loading?'Searching...':'Search'}</button>
                </div>
                <div className="ms-auto d-flex gap-2">
                    <span className="badge text-bg-secondary">Admins: {countByRole.admin||0}</span>
                    <span className="badge text-bg-secondary">Users: {countByRole.user||0}</span>
                </div>
            </div>
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.email}</td>
                                        <td>{u.name || '-'}</td>
                                        <td><span className="badge text-bg-secondary text-uppercase">{u.role}</span></td>
                                        <td className="text-end">
                                            {u.role !== 'admin' ? (
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => setRole(u._id, 'admin')}>Make admin</button>
                                            ) : (
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => setRole(u._id, 'user')}>Make user</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {!users.length && (
                                    <tr><td colSpan={4} className="text-muted">No users</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

