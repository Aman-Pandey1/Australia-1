import { NavLink, Link, useLocation } from 'react-router-dom'

export default function AdminLayout({ title = 'Admin', children }) {
	const location = useLocation()
	const links = [
		{ to: '/admin', label: 'Dashboard' },
		{ to: '/admin/users', label: 'Users' },
		{ to: '/admin/listings', label: 'Listings' },
		{ to: '/admin/ads', label: 'Ads' },
		{ to: '/admin/reviews', label: 'Reviews' },
		{ to: '/admin/comments', label: 'Comments' },
		{ to: '/admin/reports', label: 'Reports' },
		{ to: '/admin/subscriptions', label: 'Subscriptions' },
	]
	return (
        <div>
            <div className="bg-dark text-white py-4" style={{
                background: 'linear-gradient(135deg, #000 0%, rgba(229,9,20,.7) 35%, #000 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
				<div className="container d-flex flex-column flex-md-row align-items-md-end gap-3">
					<div>
						<div className="text-uppercase small opacity-75">Control Panel</div>
						<h1 className="h3 m-0 fw-bold">{title}</h1>
					</div>
					<div className="ms-md-auto">
                        <Link to="/" className="btn btn-sm btn-outline-light">Back to site</Link>
					</div>
				</div>
			</div>
            <div className="border-bottom" style={{ background: 'rgba(229,9,20,0.05)' }}>
				<div className="container">
					<ul className="nav nav-pills small overflow-auto" style={{ whiteSpace: 'nowrap' }}>
						{links.map((l) => (
							<li className="nav-item" key={l.to}>
                                <NavLink to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : 'link-dark'}`} end={l.to === '/admin'}>{l.label}</NavLink>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="container py-4">
				{children}
			</div>
		</div>
	)
}

