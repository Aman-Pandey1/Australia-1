import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Admin() {
	const [stats, setStats] = useState(null)
	useEffect(() => {
		api.get('/admin/summary').then(({ data }) => setStats(data)).catch(() => {})
	}, [])
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

