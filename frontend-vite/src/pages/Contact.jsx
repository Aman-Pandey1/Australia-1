import { useState } from 'react'

export default function Contact() {
	const [form, setForm] = useState({ name: '', email: '', message: '' })
	return (
		<div className="container py-5" style={{maxWidth: 720}}>
			<h1 className="mb-3">Contact Us</h1>
			<form className="card p-3">
				<div className="mb-3">
					<label className="form-label">Name</label>
					<input className="form-control" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
				</div>
				<div className="mb-3">
					<label className="form-label">Email</label>
					<input className="form-control" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
				</div>
				<div className="mb-3">
					<label className="form-label">Message</label>
					<textarea className="form-control" rows={5} value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} />
				</div>
				<button type="button" className="btn btn-primary" onClick={()=>alert('Submitted')}>Send</button>
			</form>
		</div>
	)
}

