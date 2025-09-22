import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function Home() {
	const [data, setData] = useState({ featured: [], popular: [], newly: [] })
	useEffect(() => {
		api.get('/listings/home/sections').then(({ data }) => setData(data)).catch(() => {})
	}, [])
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-3">Discover</h1>
			<div className="mb-4">
				<div className="row g-2">
					{['Sydney','Melbourne','Brisbane','Perth','Adelaide','Canberra'].map(c => (
						<div className="col-6 col-md-2" key={c}>
							<Link to={`/city/${c}`} className="btn btn-outline-secondary w-100">{c}</Link>
						</div>
					))}
				</div>
			</div>
			<Section title="Featured" items={data.featured} />
			<Section title="Popular" items={data.popular} />
			<Section title="Newly Added" items={data.newly} />
		</div>
	)
}

function Section({ title, items }) {
	return (
		<div className="mb-8">
			<div className="d-flex align-items-center mb-3">
				<h2 className="h4 m-0">{title}</h2>
			</div>
			<div className="row g-3">
				{items.map((it) => (
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
				{!items?.length && <div className="text-muted">No items</div>}
			</div>
		</div>
	)
}

