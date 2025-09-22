import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Dashboard() {
	const [subs, setSubs] = useState({ subscription: null, remainingDays: 0 })
	useEffect(() => {
		api.get('/subscriptions/me').then(({ data }) => setSubs(data)).catch(() => {})
	}, [])
	return (
		<div className="container py-4">
			<h1 className="h3 mb-3">My Dashboard</h1>
			<div className="row g-3">
				<div className="col-md-6">
					<div className="card shadow-sm">
						<div className="card-body">
							<div className="fw-semibold mb-1">Subscription</div>
							<div className="text-muted small">Remaining days: {subs.remainingDays}</div>
							<button className="btn btn-primary btn-sm mt-2" onClick={async () => {
								await api.post('/subscriptions/recharge', { months: 1 })
								const { data } = await api.get('/subscriptions/me')
								setSubs(data)
							}}>Recharge 1 month</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

