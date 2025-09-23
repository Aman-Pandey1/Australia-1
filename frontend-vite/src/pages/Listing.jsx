import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Listing() {
    const { slug } = useParams()
    const { user } = useAuth()
    const [listing, setListing] = useState(null)
    const [reviews, setReviews] = useState([])
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [newReview, setNewReview] = useState({ rating: 5, content: '' })
    const [newComment, setNewComment] = useState('')
    const [reportReason, setReportReason] = useState('')

    const listingId = useMemo(() => listing?._id, [listing])

    async function load() {
        try {
            setLoading(true)
            const { data } = await api.get(`/listings/slug/${slug}`)
            setListing(data.listing)
        } catch {}
        finally { setLoading(false) }
    }

    async function loadSocial() {
        if (!listingId) return
        try {
            const [{ data: r1 }, { data: r2 }] = await Promise.all([
                api.get(`/reviews/listing/${listingId}`),
                api.get(`/comments/listing/${listingId}`),
            ])
            setReviews(r1.reviews || [])
            setComments(r2.comments || [])
        } catch {}
    }

    useEffect(() => { load() }, [slug])
    useEffect(() => { loadSocial() }, [listingId])

    useEffect(() => {
        if (listing?.title) {
            document.title = `${listing.title} — Listing`
            const meta = document.querySelector('meta[name="description"]')
            if (meta) meta.setAttribute('content', listing?.description?.slice(0, 160) || 'Listing')
        }
    }, [listing])

    if (loading) return <div className="container py-5"><div className="text-muted">Loading...</div></div>
    if (!listing) return <div className="container py-5"><div className="text-muted">Not found</div></div>

    async function addFavorite() {
        try {
            if (!user) return toast.error('Login required')
            await api.post('/favorites', { listingId })
            toast.success('Added to favorites')
        } catch { toast.error('Failed') }
    }

    async function submitReview(e) {
        e.preventDefault()
        try {
            if (!user) return toast.error('Login required')
            await api.post('/reviews', { listing: listingId, rating: Number(newReview.rating), content: newReview.content })
            setNewReview({ rating: 5, content: '' })
            toast.success('Review submitted for approval')
        } catch { toast.error('Failed') }
    }

    async function submitComment(e) {
        e.preventDefault()
        try {
            if (!user) return toast.error('Login required')
            await api.post('/comments', { listing: listingId, content: newComment })
            setNewComment('')
            toast.success('Comment submitted for approval')
        } catch { toast.error('Failed') }
    }

    async function submitReport(e) {
        e.preventDefault()
        try {
            if (!user) return toast.error('Login required')
            await api.post('/reports', { listing: listingId, reason: reportReason })
            setReportReason('')
            toast.success('Report submitted')
        } catch { toast.error('Failed') }
    }

    const infoRows = [
        ['City', listing?.contact?.city || '-'],
        ['Country', listing?.contact?.country || '-'],
        ['Phone', listing?.contact?.phone || '-'],
        ['WhatsApp', listing?.contact?.whatsapp || '-'],
        ['Telegram', listing?.contact?.telegram || '-'],
        ['Gender', listing?.stats?.gender || '-'],
        ['Age', listing?.stats?.age ? String(listing.stats.age) : '-'],
        ['Height', listing?.stats?.height || '-'],
        ['Weight', listing?.stats?.weight || '-'],
        ['Measurements', listing?.stats?.measurements || '-'],
        ['Ethnicity', listing?.stats?.ethnicity || '-'],
        ['Hair', listing?.stats?.hair || '-'],
        ['Eyes', listing?.stats?.eyes || '-'],
    ]

    return (
        <div className="container py-4">
            <nav className="mb-3"><Link to="/">Home</Link> / <span>{listing.title}</span></nav>
            <h1 className="h3 mb-2">{listing.title}</h1>
            <div className="text-muted mb-3">{listing.contact?.city || ''}</div>

            {Array.isArray(listing.photos) && listing.photos.length > 0 && (
                <div className="row g-2 mb-3">
                    {listing.photos.map((url, idx) => (
                        <div className="col-6 col-md-3" key={idx}>
                            <img src={url} alt="" className="img-fluid rounded" loading="lazy" />
                        </div>
                    ))}
                </div>
            )}

            {listing.description && (
                <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                        <div dangerouslySetInnerHTML={{ __html: nl2br(escapeHtml(listing.description)) }} />
                    </div>
                </div>
            )}

            <div className="row g-3">
                <div className="col-md-7">
                    <div className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="fw-semibold">Details</div>
                                <div>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={addFavorite}>Add to favorites</button>
                                </div>
                            </div>
                            <div className="row">
                                {infoRows.map(([k, v]) => (
                                    <div className="col-6 mb-2" key={k}>
                                        <div className="text-muted small">{k}</div>
                                        <div className="fw-semibold">{v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <div className="fw-semibold mb-2">Reviews</div>
                            <div className="mb-3">
                                {reviews.map((r) => (
                                    <div className="border rounded p-2 mb-2" key={r._id}>
                                        <div className="fw-semibold">Rating: {r.rating}/5</div>
                                        <div>{r.content}</div>
                                    </div>
                                ))}
                                {!reviews.length && <div className="text-muted small">No reviews yet.</div>}
                            </div>
                            <form onSubmit={submitReview} className="row g-2">
                                <div className="col-12 col-md-3">
                                    <label className="form-label">Rating</label>
                                    <select className="form-select" value={newReview.rating} onChange={(e)=>setNewReview({...newReview, rating: e.target.value})}>
                                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div className="col-12 col-md-7">
                                    <label className="form-label">Content</label>
                                    <input className="form-control" value={newReview.content} onChange={(e)=>setNewReview({...newReview, content: e.target.value})} />
                                </div>
                                <div className="col-12 col-md-2 d-grid">
                                    <label className="form-label">&nbsp;</label>
                                    <button className="btn btn-primary">Post</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <div className="fw-semibold mb-2">Comments</div>
                            <div className="mb-3">
                                {comments.map((c) => (
                                    <div className="border rounded p-2 mb-2" key={c._id}>{c.content}</div>
                                ))}
                                {!comments.length && <div className="text-muted small">No comments yet.</div>}
                            </div>
                            <form onSubmit={submitComment} className="row g-2">
                                <div className="col-12 col-md-10">
                                    <label className="form-label">Add a comment</label>
                                    <input className="form-control" value={newComment} onChange={(e)=>setNewComment(e.target.value)} />
                                </div>
                                <div className="col-12 col-md-2 d-grid">
                                    <label className="form-label">&nbsp;</label>
                                    <button className="btn btn-primary">Post</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <div className="fw-semibold mb-2">Report</div>
                            <form onSubmit={submitReport}>
                                <div className="mb-2">
                                    <label className="form-label">Reason</label>
                                    <input className="form-control" value={reportReason} onChange={(e)=>setReportReason(e.target.value)} placeholder="Reason (e.g., fake)" />
                                </div>
                                <button className="btn btn-outline-danger btn-sm">Report</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

function nl2br(str) {
    return String(str || '').split('\n').map((s, i) => `<p key="${i}">${s}</p>`).join('')
}

