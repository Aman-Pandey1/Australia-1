import { useState } from 'react'
import api from '../lib/api'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState('')
    async function submit(e) {
        e.preventDefault()
        setStatus('')
        try {
            const { data } = await api.post('/content/contact', form)
            setStatus(data?.message || 'Thanks!')
            setForm({ name: '', email: '', message: '' })
        } catch (e) {
            setStatus(e?.response?.data?.message || 'Failed to submit')
        }
    }
    return (
        <div className="container py-5" style={{maxWidth: 720}}>
            <h1 className="mb-3">Contact Us</h1>
            <form className="card p-3" onSubmit={submit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input className="form-control" required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows={5} required value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} />
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-primary" type="submit">Send</button>
                    {status && <span className="small text-secondary">{status}</span>}
                </div>
            </form>
        </div>
    )
}

