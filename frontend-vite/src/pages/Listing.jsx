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
    const [activePhotoIdx, setActivePhotoIdx] = useState(0)
    const [sections, setSections] = useState({ featured: [], newly: [] })

    const listingId = useMemo(() => listing?._id, [listing])

    async function load() {
        try {
            setLoading(true)
            const { data } = await api.get(`/listings/slug/${slug}`)
            setListing(data.listing)
            setActivePhotoIdx(0)
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
        api.get('/listings/home/sections').then(({ data }) => setSections({ featured: data.featured || [], newly: data.newly || [] })).catch(() => {})
    }, [])

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
            <div className="d-flex align-items-center justify-content-between">
                <h1 className="h3 mb-1 text-uppercase">{listing.title}</h1>
                {listing?.premium?.level === 'vip' && <span className="badge badge-vip">DIAMOND</span>}
            </div>
            <div className="text-secondary mb-3">
                <i className="bi bi-geo-alt me-1 text-danger" />{listing.contact?.city || ''}
                {typeof listing.price === 'number' && <span className="ms-3 pill-icon pill-premium">${listing.price}/hr</span>}
            </div>

            <div className="row g-3">
                {/* Left: gallery + description + services + reviews/comments */}
                <div className="col-lg-8">
                    {/* Gallery */}
                    {Array.isArray(listing.photos) && listing.photos.length > 0 && (
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <div className="mb-2">
                                    <img src={listing.photos[activePhotoIdx]} alt="" className="img-fluid rounded w-100" style={{ maxHeight: 520, objectFit: 'cover' }} />
                                </div>
                                <div className="d-flex gap-2 flex-wrap">
                                    {listing.photos.map((url, idx) => (
                                        <button key={idx} type="button" className={`p-0 border-0 bg-transparent ${activePhotoIdx === idx ? 'opacity-100' : 'opacity-75'}`} onClick={() => setActivePhotoIdx(idx)}>
                                            <img src={url} alt="thumb" className="rounded" style={{ width: 90, height: 90, objectFit: 'cover', border: activePhotoIdx === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* About me */}
                    {listing.description && (
                        <div className="card mb-3 shadow-sm" style={{ borderColor: 'rgba(229,9,20,.25)' }}>
                            <div className="card-body">
                                <div className="fw-semibold mb-2">About me</div>
                                <div dangerouslySetInnerHTML={{ __html: nl2br(escapeHtml(listing.description)) }} />
                            </div>
                        </div>
                    )}

                    {/* Services (use categories as a proxy) */}
                    {Array.isArray(listing.categories) && listing.categories.length > 0 && (
                        <div className="card mb-3 shadow-sm" style={{ borderColor: 'rgba(229,9,20,.25)' }}>
                            <div className="card-body">
                                <div className="fw-semibold mb-2">Services</div>
                                <div className="d-flex flex-wrap gap-2">
                                    {listing.categories.map((c) => (
                                        <span key={c} className="badge" style={{ background:'#1a1a1a', border:'1px solid #262626', color:'#f2f2f2' }}>{c}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
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

                    {/* Comments */}
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

                {/* Right: info, contact, rates, availability, report */}
                <div className="col-lg-4">
                    <div className="card mb-3 shadow-sm" style={{ borderColor: 'rgba(229,9,20,.25)' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="fw-semibold">Info</div>
                                <div>
                                    <button className="btn btn-sm btn-outline-primary" onClick={addFavorite}>Add to favorites</button>
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

                    <div className="card mb-3 shadow-sm" style={{ borderColor: 'rgba(229,9,20,.25)' }}>
                        <div className="card-body">
                            <div className="fw-semibold mb-2">Contact</div>
                            <div className="mb-1"><span className="text-muted small d-block">City</span><span className="fw-semibold">{listing?.contact?.city || '-'}</span></div>
                            {listing?.contact?.address && <div className="mb-1"><span className="text-muted small d-block">Address</span><span className="fw-semibold">{listing.contact.address}</span></div>}
                            <div className="mb-1"><span className="text-muted small d-block">Country</span><span className="fw-semibold">{listing?.contact?.country || '-'}</span></div>
                            {listing?.contact?.phone && <div className="mb-1"><span className="text-muted small d-block">Phone</span><span className="fw-semibold">{listing.contact.phone}</span></div>}
                            {listing?.contact?.whatsapp && <div className="mb-1"><span className="text-muted small d-block">WhatsApp</span><span className="fw-semibold">{listing.contact.whatsapp}</span></div>}
                            {listing?.contact?.telegram && <div className="mb-1"><span className="text-muted small d-block">Telegram</span><span className="fw-semibold">{listing.contact.telegram}</span></div>}
                        </div>
                    </div>

                    {listing?.rates && (
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <div className="fw-semibold mb-2">Rates</div>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="text-muted small mb-1">In-call</div>
                                        <ul className="list-unstyled small mb-0">
                                            {Object.entries(listing.rates.incall || {}).map(([k,v]) => (
                                                <li key={k} className="d-flex justify-content-between"><span>{k}</span><span className="fw-semibold">{v}</span></li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="text-muted small mb-1">Out-call</div>
                                        <ul className="list-unstyled small mb-0">
                                            {Object.entries(listing.rates.outcall || {}).map(([k,v]) => (
                                                <li key={k} className="d-flex justify-content-between"><span>{k}</span><span className="fw-semibold">{v}</span></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {listing?.availability && (
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <div className="fw-semibold mb-2">Availability</div>
                                <div className="small text-secondary">{listing.availability}</div>
                            </div>
                        </div>
                    )}

                    <div className="card mb-3 shadow-sm" style={{ borderColor: 'rgba(229,9,20,.25)' }}>
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

            {/* Explore / We also recommend */}
            <section className="mt-4">
                <h2 className="h6 mb-2">Explore</h2>
                <div className="scroll-row">
                    {(sections.featured.length ? sections.featured : sections.newly).slice(0, 12).map((it, idx) => (
                        <div key={it._id} className="card listing-card">
                            <Link to={`/l/${it.slug}`} className="text-decoration-none text-reset">
                                <div className="ratio-1x1">
                                    <div className="bg-cover" style={{ backgroundImage: `url(${(it.photos?.[0]) || 'https://picsum.photos/seed/rec'+idx+'/800/800'})` }}></div>
                                    <div className="thumb-overlay"></div>
                                </div>
                            </Link>
                            <div className="card-body">
                                <div className="fw-semibold text-truncate">{it.title}</div>
                                <div className="small text-secondary">{it.contact?.city}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
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

