import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logout } = useAuth()
    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-dark shadow-sm">
            <div className="container py-2">
                <Link to="/" className="navbar-brand fw-extrabold">
                    escortify
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="nav">
                    <ul className="navbar-nav ms-auto align-items-lg-center mb-2 mb-lg-0 gap-lg-2">
                        <li className="nav-item"><NavLink to="/" className="nav-link">Home</NavLink></li>
                        <li className="nav-item"><NavLink to="/blogs" className="nav-link">Blogs</NavLink></li>
                        <li className="nav-item"><NavLink to="/contact" className="nav-link">Contact</NavLink></li>
                        {user ? (
                            <>
                                <li className="nav-item"><NavLink to="/dashboard" className="nav-link">Dashboard</NavLink></li>
                                {user.role === 'admin' && <li className="nav-item"><NavLink to="/admin" className="nav-link">Admin</NavLink></li>}
                                <li className="nav-item"><button onClick={logout} className="btn btn-sm btn-outline-secondary ms-lg-2">Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><NavLink to="/login" className="nav-link">Login</NavLink></li>
                                <li className="nav-item"><NavLink to="/register" className="btn btn-sm btn-primary ms-lg-2">Add advertisement</NavLink></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

