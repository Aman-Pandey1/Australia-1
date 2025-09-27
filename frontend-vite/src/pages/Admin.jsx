import { useEffect, useState } from 'react'
import api from '../lib/api'
import AdminLayout from './admin/AdminLayout'

export default function Admin() {
	const [stats, setStats] = useState(null)
    const [pendingListings, setPendingListings] = useState([])
    const [pendingAds, setPendingAds] = useState([])
    const [users, setUsers] = useState([])
    const [allListings, setAllListings] = useState([])
    const [posts, setPosts] = useState([])
    const [pages, setPages] = useState([])
    const [editingPost, setEditingPost] = useState(null)
    const [editingPage, setEditingPage] = useState(null)
	useEffect(() => {
        api.get('/admin/summary').then(({ data }) => setStats(data)).catch(() => {})
        refreshQueues()
        refreshUsers()
        refreshCms()
        refreshAllListings()
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
    async function refreshAllListings() {
        try {
            const { data } = await api.get('/admin/listings')
            setAllListings(data.listings || [])
        } catch {}
    }
    async function refreshCms() {
        try {
            const [{ data: postsData }, { data: pagesData }] = await Promise.all([
                api.get('/admin/posts'),
                api.get('/admin/pages'),
            ])
            setPosts(postsData.posts || [])
            setPages(pagesData.pages || [])
        } catch {}
    }
    async function setRole(userId, role) {
        await api.patch(`/admin/users/${userId}/role`, { role })
        await refreshUsers()
    }
    async function setAccountType(userId, accountType) {
        await api.patch(`/admin/users/${userId}/account-type`, { accountType })
        await refreshUsers()
    }
	return (
		<AdminLayout title="Dashboard">
			{!stats ? (
				<div className="text-muted">Loading...</div>
			) : (
				<div className="row g-3">
					<Card title="Users" value={stats.users} to="/admin/users" />
					<Card title="Listings Pending" value={stats.listingsPending} to="/admin/listings?filter=pending" />
					<Card title="Listings Approved" value={stats.listingsApproved} to="/admin/listings?filter=approved" />
					<Card title="Reviews Pending" value={stats.reviewsPending} to="/admin/reviews" />
					<Card title="Comments Pending" value={stats.commentsPending} to="/admin/comments" />
					<Card title="Reports Pending" value={stats.reportsPending} to="/admin/reports" />
					<Card title="Ads Pending" value={stats.adsPending} to="/admin/ads" />
					<Card title="Active Subs" value={stats.subsActive} to="/admin/subscriptions" />
				</div>
			)}
            <div className="mt-4">
                <h2 className="h5 mb-2">Listings awaiting approval</h2>
                <div className="row g-2">
                    {pendingListings.map(l => (
                        <div className="col-md-6" key={l._id}>
                            <ApproveCard listing={l} onDone={refreshQueues} />
                        </div>
                    ))}
                    {!pendingListings.length && <div className="text-muted">No pending listings.</div>}
                </div>
            </div>

            <div className="mt-4">
                <h2 className="h5 mb-2">All Listings</h2>
                <div className="table-responsive">
                    <table className="table table-sm align-middle">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>City</th>
                                <th>Status</th>
                                <th>Tier</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {allListings.map(l => (
                                <tr key={l._id}>
                                    <td className="fw-semibold">{l.title}</td>
                                    <td className="text-muted small">{l.contact?.city || '-'}</td>
                                    <td>
                                        <span className={`badge ${l.status==='approved'?'text-bg-success':(l.status==='pending'?'text-bg-warning':'text-bg-secondary')}`}>{l.status}</span>
                                    </td>
                                    <td>
                                        <TierBadge level={l?.premium?.level || 'none'} />
                                    </td>
                                    <td className="text-end">
                                        <TierEditor listing={l} onSaved={refreshAllListings} />
                                    </td>
                                </tr>
                            ))}
                            {!allListings.length && (
                                <tr><td colSpan={5} className="text-muted">No listings</td></tr>
                            )}
                        </tbody>
                    </table>
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
                                <th>Account type</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.email}</td>
                                    <td>{u.name || '-'}</td>
                                    <td><span className="badge text-bg-secondary">{u.role}</span></td>
                                    <td>
                                        <div className="d-inline-flex gap-2 align-items-center">
                                            <span className="badge text-bg-dark">{u.accountType || 'user'}</span>
                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setAccountType(u._id, u.accountType === 'agent' ? 'user' : 'agent')}>{u.accountType === 'agent' ? 'Make user' : 'Make agent'}</button>
                                        </div>
                                    </td>
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

            {/* CMS: Posts */}
            <div className="mt-5">
                <h2 className="h5 mb-2">Posts</h2>
                <div className="mb-2"><button className="btn btn-sm btn-primary" onClick={()=>setEditingPost({ title: '', slug: '', description: '', content: '', status: 'draft' })}>New Post</button></div>
                <div className="table-responsive">
                    <table className="table table-sm align-middle">
                        <thead><tr><th>Title</th><th>Slug</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                            {posts.map(p => (
                                <tr key={p._id}>
                                    <td>{p.title}</td>
                                    <td>{p.slug}</td>
                                    <td><span className="badge text-bg-secondary">{p.status}</span></td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>setEditingPost(p)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={async ()=>{ await api.delete(`/admin/posts/${p._id}`); refreshCms() }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {!posts.length && <tr><td colSpan={4} className="text-muted">No posts</td></tr>}
                        </tbody>
                    </table>
                </div>
                {editingPost && <Editor type="post" value={editingPost} onClose={()=>setEditingPost(null)} onSaved={()=>{ setEditingPost(null); refreshCms() }} />}
            </div>

            {/* CMS: Pages */}
            <div className="mt-5">
                <h2 className="h5 mb-2">Pages</h2>
                <div className="mb-2"><button className="btn btn-sm btn-primary" onClick={()=>setEditingPage({ title: '', slug: '', description: '', content: '' })}>New Page</button></div>
                <div className="table-responsive">
                    <table className="table table-sm align-middle">
                        <thead><tr><th>Title</th><th>Slug</th><th></th></tr></thead>
                        <tbody>
                            {pages.map(p => (
                                <tr key={p._id}>
                                    <td>{p.title}</td>
                                    <td>{p.slug}</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>setEditingPage(p)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={async ()=>{ await api.delete(`/admin/pages/${p._id}`); refreshCms() }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {!pages.length && <tr><td colSpan={3} className="text-muted">No pages</td></tr>}
                        </tbody>
                    </table>
                </div>
                {editingPage && <Editor type="page" value={editingPage} onClose={()=>setEditingPage(null)} onSaved={()=>{ setEditingPage(null); refreshCms() }} />}
            </div>
		</AdminLayout>
	)
}

function Card({ title, value, to }) {
	return (
		<div className="col-6 col-md-3">
			<a href={to || '#'} className="text-decoration-none text-reset">
				<div className="card border-0 shadow-sm card-hover">
					<div className="card-body">
						<div className="d-flex align-items-center justify-content-between">
							<div>
								<div className="text-uppercase small opacity-75">{title}</div>
								<div className="h4 m-0 fw-bold">{value}</div>
							</div>
							<div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: 'rgba(13,110,253,0.12)' }}>
								<i className="bi bi-arrow-right-short fs-4 text-primary" />
							</div>
						</div>
					</div>
				</div>
			</a>
		</div>
	)
}

function TierBadge({ level }) {
    const map = {
        none: { text: 'Free', cls: 'text-bg-secondary' },
        featured: { text: 'Featured', cls: 'text-bg-info' },
        premium: { text: 'Premium', cls: 'text-bg-primary' },
        vip: { text: 'Diamond', cls: 'text-bg-warning' },
    }
    const cur = map[level] || map.none
    return <span className={`badge ${cur.cls}`}>{cur.text}</span>
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

function Editor({ type, value, onClose, onSaved }) {
    const [form, setForm] = useState(value)
    async function save(e) {
        e.preventDefault()
        const path = type === 'post' ? '/admin/posts' : '/admin/pages'
        const id = form._id
        if (type === 'post') form.status = form.status || 'draft'
        if (id) {
            await api.put(`${path}/${id}`, form)
        } else {
            await api.post(path, form)
        }
        onSaved?.()
    }
    return (
        <div className="card p-3 mt-3">
            <form onSubmit={save}>
                <div className="row g-2">
                    <div className="col-md-4">
                        <label className="form-label">Title</label>
                        <input className="form-control" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Slug</label>
                        <input className="form-control" value={form.slug} onChange={(e)=>setForm({...form, slug: e.target.value})} />
                    </div>
                    {type === 'post' && (
                        <div className="col-md-4">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={form.status} onChange={(e)=>setForm({...form, status: e.target.value})}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    )}
                    <div className="col-12">
                        <label className="form-label">Description</label>
                        <input className="form-control" value={form.description || ''} onChange={(e)=>setForm({...form, description: e.target.value})} />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Content (HTML)</label>
                        <textarea className="form-control" rows={8} value={form.content || ''} onChange={(e)=>setForm({...form, content: e.target.value})} />
                    </div>
                    <div className="col-12 d-flex gap-2">
                        <button className="btn btn-primary" type="submit">Save</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

function ApproveCard({ listing, onDone }) {
    const [premium, setPremium] = useState({ level: 'none', cities: '', showOnHomepage: false })
    async function approve(status) {
        const payload = { status }
        if (status === 'approved') {
            const p = { ...premium }
            if (p.cities) p.cities = p.cities.split(',').map(s=>s.trim()).filter(Boolean)
            payload.premium = { level: p.level }
            if (p.level === 'vip') payload.premium.showOnHomepage = true
            if (Array.isArray(p.cities)) payload.premium.cities = p.cities
        }
        await api.patch(`/admin/listings/${listing._id}/status`, payload)
        onDone?.()
    }
    return (
        <div className="border rounded p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <div className="fw-semibold">{listing.title}</div>
                    <div className="text-muted small">{listing.contact?.city || '-'}</div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>approve('rejected')}>Reject</button>
                    <button className="btn btn-sm btn-success" onClick={()=>approve('approved')}>Approve</button>
                </div>
            </div>
            <div className="row g-2">
                <div className="col-md-4">
                    <label className="form-label">Premium level</label>
                    <select className="form-select form-select-sm" value={premium.level} onChange={(e)=>setPremium({ ...premium, level: e.target.value })}>
                        <option value="none">Free</option>
                        <option value="featured">Featured (city)</option>
                        <option value="premium">Premium (multi-city)</option>
                        <option value="vip">Diamond (VIP)</option>
                    </select>
                </div>
                {(premium.level === 'featured' || premium.level === 'premium') && (
                    <div className="col-md-8">
                        <label className="form-label">Cities (comma separated)</label>
                        <input className="form-control form-control-sm" placeholder="Sydney, Melbourne" value={premium.cities} onChange={(e)=>setPremium({ ...premium, cities: e.target.value })} />
                    </div>
                )}
            </div>
        </div>
    )
}

