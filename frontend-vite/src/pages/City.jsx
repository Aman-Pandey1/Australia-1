import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

export default function City() {
	const { city } = useParams()
	const [items, setItems] = useState([])
	useEffect(()=>{
		api.get(`/listings/city/${city}`).then(({data})=>setItems(data.listings||[])).catch(()=>{})
	},[city])
	return (
		<div className="container py-5">
			<h1 className="mb-4">{city}</h1>
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

