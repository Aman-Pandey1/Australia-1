import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../lib/api'

export default function Category() {
	const { slug } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const [items, setItems] = useState([])
	const city = searchParams.get('city') || ''
	const gender = searchParams.get('gender') || ''
	const premium = searchParams.get('premium') || ''

	const category = useMemo(() => decodeURIComponent(slug || ''), [slug])

	useEffect(() => {
		const params = {}
		if (city) params.city = city
		if (gender) params.gender = gender
		if (premium) params.premium = premium
		api.get(`/listings/category/${encodeURIComponent(category)}`, { params }).then(({ data }) => setItems(data.listings || [])).catch(() => {})
	}, [category, city, gender, premium])

	function updateFilter(key, value) {
		const next = new URLSearchParams(searchParams)
		if (value) next.set(key, value); else next.delete(key)
		setSearchParams(next)
	}

	return (
		<div className="container py-5">
			<h1 className="mb-4">{category}</h1>
			<div className="row g-2 mb-3">
				<div className="col-6 col-md-3">
					<select className="form-select" value={city} onChange={(e)=>updateFilter('city', e.target.value)}>
						<option value="">All cities</option>
						{['Sydney','Melbourne','Brisbane','Perth','Adelaide','Canberra'].map(c => <option key={c} value={c}>{c}</option>)}
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
				{items.map(it => (
					<div className="col-6 col-md-3" key={it._id}>
						<div className="card h-100 shadow-sm">
							<div className="ratio ratio-1x1 bg-light" style={{ backgroundImage: `url(${it.photos?.[0] || ''})`, backgroundSize: 'cover' }} />
							<div className="card-body">
								<div className="fw-semibold">{it.title}</div>
								<div className="text-muted small">{it.contact?.city}</div>
							</div>
						</div>
					</div>
				))}
				{!items.length && <div className="text-muted">No items</div>}
			</div>
		</div>
	)
}