import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
	const { user, logout } = useAuth()
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
			<div className="container">
				<Link to="/" className="navbar-brand">Site</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="nav">
					<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
						<li className="nav-item"><NavLink to="/" className="nav-link">Home</NavLink></li>
						<li className="nav-item"><NavLink to="/about" className="nav-link">About Us</NavLink></li>
						<li className="nav-item"><NavLink to="/blogs" className="nav-link">Blogs</NavLink></li>
						<li className="nav-item"><NavLink to="/contact" className="nav-link">Contact Us</NavLink></li>
						{user ? (
							<>
								<li className="nav-item"><NavLink to="/dashboard" className="nav-link">Dashboard</NavLink></li>
								{user.role === 'admin' && <li className="nav-item"><NavLink to="/admin" className="nav-link">Admin</NavLink></li>}
								<li className="nav-item"><button onClick={logout} className="btn btn-sm btn-outline-secondary ms-3">Logout</button></li>
							</>
						) : (
							<>
								<li className="nav-item"><NavLink to="/login" className="nav-link">Login</NavLink></li>
								<li className="nav-item"><NavLink to="/register" className="nav-link">Register</NavLink></li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	)
}

