import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Admin() {
	const [stats, setStats] = useState(null)
    const [pendingListings, setPendingListings] = useState([])
    const [pendingAds, setPendingAds] = useState([])
    const [users, setUsers] = useState([])
	useEffect(() => {
        api.get('/admin/summary').then(({ data }) => setStats(data)).catch(() => {})
        refreshQueues()
        refreshUsers()
	}, [])

    async function refreshQueues() {
        try {
            const [{ data: listData }, { data: adData }] = await Promise.all([
                api.get('/admin/listings', { params: { status: 'pending' } }),
                api.get('/admin/ads'),
            ])
            setPendingListings(listData.listings || [])
            setPendingAds((adData.ads || []).filter(a => a.status === 'pending'))
        } catch {}
    }
    async function refreshUsers() {
        try {
            const { data } = await api.get('/admin/users')
            setUsers(data.users || [])
        } catch {}
    }
    async function setRole(userId, role) {
        await api.patch(`/admin/users/${userId}/role`, { role })
        await refreshUsers()
    }
	return (
		<div className="container py-4">
			<h1 className="h3 mb-4">Admin Panel</h1>
			{!stats ? (
				<div className="text-muted">Loading...</div>
			) : (
				<div className="row g-3">
					<Card title="Users" value={stats.users} />
					<Card title="Listings Pending" value={stats.listingsPending} />
					<Card title="Listings Approved" value={stats.listingsApproved} />
					<Card title="Reviews Pending" value={stats.reviewsPending} />
					<Card title="Comments Pending" value={stats.commentsPending} />
					<Card title="Reports Pending" value={stats.reportsPending} />
					<Card title="Ads Pending" value={stats.adsPending} />
					<Card title="Active Subs" value={stats.subsActive} />
				</div>
			)}
            <div className="mt-4">
                <h2 className="h5 mb-2">Listings awaiting approval</h2>
                <div className="row g-2">
                    {pendingListings.map(l => (
                        <div className="col-md-6" key={l._id}>
                            <div className="border rounded p-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-semibold">{l.title}</div>
                                    <div className="text-muted small">{l.contact?.city || '-'}</div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-danger" onClick={async ()=>{ await api.patch(`/admin/listings/${l._id}/status`, { status: 'rejected' }); refreshQueues() }}>Reject</button>
                                    <button className="btn btn-sm btn-success" onClick={async ()=>{ await api.patch(`/admin/listings/${l._id}/status`, { status: 'approved' }); refreshQueues() }}>Approve</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!pendingListings.length && <div className="text-muted">No pending listings.</div>}
                </div>
            </div>

            <div className="mt-4">
                <h2 className="h5 mb-2">Ad purchases awaiting approval</h2>
                <div className="row g-2">
                    {pendingAds.map(a => (
                        <div className="col-md-6" key={a._id}>
                            <div className="border rounded p-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-semibold">{a.listing?.title || a.listing}</div>
                                    <div className="text-muted small">{a.type} • ${a.priceUsd}</div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-danger" onClick={async ()=>{ await api.patch(`/admin/ads/${a._id}/status`, { status: 'rejected' }); refreshQueues() }}>Reject</button>
                                    <button className="btn btn-sm btn-success" onClick={async ()=>{ await api.patch(`/admin/ads/${a._id}/status`, { status: 'approved' }); refreshQueues() }}>Approve</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!pendingAds.length && <div className="text-muted">No pending ads.</div>}
                </div>
            </div>

            <div className="mt-4">
                <h2 className="h5 mb-2">Users</h2>
                <div className="table-responsive">
                    <table className="table table-sm align-middle">
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
                                    <td><span className="badge text-bg-secondary">{u.role}</span></td>
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
                                <tr>
                                    <td colSpan={4} className="text-muted">No users</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
	)
}

function Card({ title, value }) {
	return (
		<div className="col-6 col-md-3">
			<div className="card shadow-sm">
				<div className="card-body">
					<div className="text-muted text-uppercase small">{title}</div>
					<div className="h4 m-0">{value}</div>
				</div>
			</div>
		</div>
	)
}

