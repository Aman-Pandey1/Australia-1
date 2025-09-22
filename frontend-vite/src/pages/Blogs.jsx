import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function Blogs() {
	const [posts, setPosts] = useState([])
	useEffect(()=>{
		api.get('/content/posts').then(({data})=>setPosts(data.posts||[])).catch(()=>{})
	},[])
	return (
		<div className="container py-5">
			<h1 className="mb-4">Blogs</h1>
			<div className="row g-3">
				{posts.map(p=> (
					<div className="col-md-6 col-lg-4" key={p._id}>
						<div className="card h-100">
							<div className="card-body">
								<h5 className="card-title"><Link to={`/blogs/${p.slug}`}>{p.title}</Link></h5>
								<p className="card-text text-muted">{p.description}</p>
							</div>
						</div>
					</div>
				))}
				{!posts.length && <div className="text-muted">No posts yet.</div>}
			</div>
		</div>
	)
}

