import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function About() {
    const [page, setPage] = useState(null)
    useEffect(()=>{ api.get('/content/pages/about').then(({data})=>setPage(data.page)).catch(()=>{}) },[])
    return (
        <div className="container py-5">
            <h1 className="mb-3">{page?.title || 'About Us'}</h1>
            {page ? (
                <div>
                    {page.description && <p className="text-muted">{page.description}</p>}
                    <div dangerouslySetInnerHTML={{ __html: page.content }} />
                </div>
            ) : (
                <p className="text-muted">Loading...</p>
            )}
        </div>
    )
}

