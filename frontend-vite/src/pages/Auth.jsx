import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function Login() {
	const { login } = useAuth()
	const [email, setEmail] = useState('admin@example.com')
	const [password, setPassword] = useState('Admin@123456')
	async function onSubmit(e) {
		e.preventDefault()
		await login(email, password)
	}
	return (
		<div className="container py-5">
			<div className="row justify-content-center">
				<div className="col-md-4">
					<h1 className="h3 mb-3">Login</h1>
					<form onSubmit={onSubmit}>
						<div className="mb-3">
							<label className="form-label">Email</label>
							<input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div className="mb-3">
							<label className="form-label">Password</label>
							<input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
						</div>
						<button className="btn btn-primary w-100">Login</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export function Register() {
	const { register } = useAuth()
	const [values, setValues] = useState({ email: '', password: '', name: '' })
	async function onSubmit(e) {
		e.preventDefault()
		await register(values)
	}
	return (
		<div className="container py-5">
			<div className="row justify-content-center">
				<div className="col-md-5">
					<h1 className="h3 mb-3">Register</h1>
					<form onSubmit={onSubmit}>
						<div className="mb-3">
							<label className="form-label">Name</label>
							<input className="form-control" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
						</div>
						<div className="mb-3">
							<label className="form-label">Email</label>
							<input className="form-control" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
						</div>
						<div className="mb-3">
							<label className="form-label">Password</label>
							<input type="password" className="form-control" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
						</div>
						<button className="btn btn-primary w-100">Create account</button>
					</form>
				</div>
			</div>
		</div>
	)
}

