import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function Home() {
	const [data, setData] = useState({ diamond: [], premium: [], free: [], featured: [], popular: [], newly: [] })
	const [homepageAds, setHomepageAds] = useState([])

	useEffect(() => {
		api.get('/listings/home/sections').then(({ data }) => setData(data)).catch(() => {})
		api.get('/ads/homepage/active').then(({ data }) => setHomepageAds(data.ads || [])).catch(() => {})
	}, [])

	return (
		<div className="container py-4">
			{/* Hero VIP scroll row */}
			{homepageAds?.length > 0 && (
				<section className="mb-4">
					<div className="d-flex align-items-center justify-content-between mb-2">
						<h2 className="section-title h5 m-0">VIP on homepage</h2>
					</div>
					<div className="scroll-row">
						{homepageAds.map(({ listing, _id }, idx) => (
							<div key={_id} className="card listing-card">
								<Link to={listing?.slug ? `/l/${listing.slug}` : '#'} className="text-decoration-none text-reset">
									<div className="ratio-1x1">
										<div className="bg-cover" style={{ backgroundImage: `url(${listing?.photos?.[0] || ''})` }}></div>
										<div className="thumb-overlay"></div>
										<div className="ribbon">Available now</div>
										<div className="pill pill-gold">VIP</div>
									</div>
								</Link>
								<div className="card-body">
									<div className="fw-semibold text-truncate">{listing?.title}</div>
									<div className="small text-secondary">{listing?.contact?.city || 'Australia'}</div>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Featured independent escorts */}
			<section className="mb-5">
				<div className="d-flex align-items-center justify-content-between mb-2">
					<h2 className="section-title h5 m-0">Featured independent escorts</h2>
					<div className="section-sub small">Take a look at our verified featured escorts from around Australia.</div>
				</div>
				<div className="scroll-row">
					{(data.featured || []).map((it) => (
						<div key={it._id} className="card listing-card">
							<Link to={`/l/${it.slug}`} className="text-decoration-none text-reset">
								<div className="ratio-1x1">
									<div className="bg-cover" style={{ backgroundImage: `url(${it.photos?.[0] || ''})` }}></div>
									<div className="thumb-overlay"></div>
									<div className="pill pill-gold">FEATURED</div>
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

			{/* Latest escorts grid */}
			<section className="mb-5">
				<h2 className="section-title h5 mb-2">Latest Australian escorts and adult entertainers</h2>
				<div className="row g-3">
					{(data.newly || []).slice(0, 12).map((it) => (
						<div className="col-6 col-md-3 col-lg-2" key={it._id}>
							<div className="card h-100 listing-card">
								<Link to={`/l/${it.slug}`} className="text-decoration-none text-reset">
									<div className="ratio-1x1">
										<div className="bg-cover" style={{ backgroundImage: `url(${it.photos?.[0] || ''})` }}></div>
										<div className="thumb-overlay"></div>
									</div>
								</Link>
								<div className="card-body">
									<div className="fw-semibold text-truncate">{it.title}</div>
									<div className="small text-secondary">{it.contact?.city}</div>
								</div>
							</div>
						</div>
					))}
					{!(data.newly || []).length && <div className="text-secondary">No items</div>}
				</div>
			</section>

			{/* About + FAQ */}
			<section className="mb-5">
				<h2 className="section-title h5 mb-3">About</h2>
				<div className="row g-3">
					<div className="col-12 col-lg-4">
						<div className="card h-100">
							<div className="card-body">
								<h3 className="h6">Why Escortify?</h3>
								<p className="small text-secondary mb-0">We provide a user-centric adult directory with authentic profiles, curated experiences, and safety-first processes, built for Australian audiences.</p>
							</div>
						</div>
					</div>
					<div className="col-12 col-lg-4">
						<div className="card h-100">
							<div className="card-body">
								<h3 className="h6">The Escortify difference</h3>
								<p className="small text-secondary mb-0">Modern UI, fast search, and verified features to highlight quality listings. Our team designs delightful experiences across desktop and mobile.</p>
							</div>
						</div>
					</div>
					<div className="col-12 col-lg-4">
						<div className="card h-100">
							<div className="card-body">
								<h3 className="h6">Verified escorts</h3>
								<p className="small text-secondary mb-0">We continually review content and work with providers to surface trustworthy, safer profiles for audiences and advertisers.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mb-2">
				<h2 className="section-title h5 mb-3">Frequently asked questions</h2>
				<div className="accordion" id="faq">
					<div className="accordion-item bg-transparent border-secondary">
						<h2 className="accordion-header" id="q1">
							<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a1" aria-expanded="false" aria-controls="a1">How do I advertise?</button>
						</h2>
						<div id="a1" className="accordion-collapse collapse" aria-labelledby="q1" data-bs-parent="#faq">
							<div className="accordion-body text-secondary">Create an account and use the Add advertisement button to submit your listing with photos and details. Your ad will appear after approval.</div>
						</div>
					</div>
					<div className="accordion-item bg-transparent border-secondary">
						<h2 className="accordion-header" id="q2">
							<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a2" aria-expanded="false" aria-controls="a2">Is my data safe?</button>
						</h2>
						<div id="a2" className="accordion-collapse collapse" aria-labelledby="q2" data-bs-parent="#faq">
							<div className="accordion-body text-secondary">We follow security best practices and never share private details without consent. You can manage privacy from your account settings.</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

