import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

export default function BlogDetail() {
	const { slug } = useParams()
	const [post, setPost] = useState(null)
	useEffect(()=>{
		api.get(`/content/posts/${slug}`).then(({data})=>setPost(data.post)).catch(()=>{})
	},[slug])
	if(!post) return <div className="container py-5"><div className="text-muted">Loading...</div></div>
	return (
		<div className="container py-5">
			<h1 className="mb-3">{post.title}</h1>
			<p className="text-muted">{post.description}</p>
			<div dangerouslySetInnerHTML={{__html: post.content}} />
		</div>
	)
}

