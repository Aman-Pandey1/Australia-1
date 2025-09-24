import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Admin() {
	const [stats, setStats] = useState(null)
    const [pendingListings, setPendingListings] = useState([])
    const [pendingAds, setPendingAds] = useState([])
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [pages, setPages] = useState([])
    const [editingPost, setEditingPost] = useState(null)
    const [editingPage, setEditingPage] = useState(null)
	useEffect(() => {
        api.get('/admin/summary').then(({ data }) => setStats(data)).catch(() => {})
        refreshQueues()
        refreshUsers()
        refreshCms()
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

