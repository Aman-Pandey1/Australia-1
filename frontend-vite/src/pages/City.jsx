import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../lib/api'

export default function City() {
	const { city } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [items, setItems] = useState([])
    const gender = searchParams.get('gender') || ''
    const premium = searchParams.get('premium') || ''
    const category = searchParams.get('category') || ''

    useEffect(()=>{
        const params = {}
        if (gender) params.gender = gender
        if (premium) params.premium = premium
        if (category) params.category = category
        api.get(`/listings/city/${city}`, { params }).then(({data})=>setItems(data.listings||[])).catch(()=>{})
    },[city, gender, premium, category])

    function updateFilter(key, value) {
        const next = new URLSearchParams(searchParams)
        if (value) next.set(key, value); else next.delete(key)
        setSearchParams(next)
    }
	return (
		<div className="container py-5">
			<h1 className="mb-4">{city}</h1>
            <div className="row g-2 mb-3">
                <div className="col-6 col-md-3">
                    <select className="form-select" value={category} onChange={(e)=>updateFilter('category', e.target.value)}>
                        <option value="">All categories</option>
                        {['Escort','Massage','Agency','Independent','GFE','BDSM'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="col-6 col-md-3">
                    <select className="form-select" value={gender} onChange={(e)=>updateFilter('gender', e.target.value)}>
                        <option value="">All genders</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="trans">Trans</option>
                    </select>
                </div>
                <div className="col-6 col-md-3">
                    <select className="form-select" value={premium} onChange={(e)=>updateFilter('premium', e.target.value)}>
                        <option value="">All levels</option>
                        <option value="vip">Diamond (VIP)</option>
                        <option value="premium">Premium</option>
                        <option value="free">Free</option>
                    </select>
                </div>
            </div>
            <div className="row g-3">
                {items.map((it, idx) => (
                    <div className="col-6 col-md-3" key={it._id}>
                        <div className="card h-100 shadow-sm listing-card">
                            <div className="ratio ratio-1x1 bg-light" style={{ backgroundImage: `url(${it.photos?.[0] || `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80&sig=${idx}`})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div className="card-body">
                                <div className="fw-semibold text-truncate">{it.title}</div>
                                <div className="text-muted small">{it.stats?.age ? `${it.stats.age} yrs` : 'Age private'} • {it.contact?.city || city} • {it.contact?.address || 'Private'}</div>
                                <div className="text-muted small">{it.contact?.phone || '04XX XXX XXX'}</div>
                                {it.price && <div className="small"><span className="badge-vip">${it.price} / hour</span></div>}
                            </div>
                        </div>
                    </div>
                ))}
                {!items.length && <div className="text-muted">No items</div>}
            </div>
		</div>
	)
}

