import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-dark shadow-sm navbar-blur sticky-top">
            <div className="container py-2">
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-uppercase">
                    <span className="d-inline-block rounded-circle" style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--color-primary), #ff6b9a)' }}></span>
                    <span>Escortify</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="nav">
                    <ul className="navbar-nav ms-auto align-items-lg-center mb-2 mb-lg-0 gap-lg-2">
                        <li className="nav-item"><NavLink to="/" className="nav-link">Home</NavLink></li>
                        <li className="nav-item"><NavLink to="/about" className="nav-link">About</NavLink></li>
                        <li className="nav-item"><NavLink to="/blogs" className="nav-link">Blog</NavLink></li>
                        <li className="nav-item"><NavLink to="/contact" className="nav-link">Contact</NavLink></li>
                        {/* Cities dropdown */}
                        <li className="nav-item dropdown d-none d-lg-block">
                            <a className="nav-link dropdown-toggle" href="#" id="cities" role="button" data-bs-toggle="dropdown" aria-expanded="false">Cities</a>
                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="cities">
                                {['Sydney','Melbourne','Brisbane','Perth','Adelaide','Canberra'].map((c) => (
                                    <li key={c}><NavLink className="dropdown-item" to={`/city/${encodeURIComponent(c)}`}>{c}</NavLink></li>
                                ))}
                            </ul>
                        </li>
                        {/* Theme toggle */}
                        <li className="nav-item d-flex align-items-center ms-2">
                            <button onClick={toggleTheme} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2" aria-label="Toggle theme">
                                <i className={theme === 'dark' ? 'bi bi-moon-stars' : 'bi bi-brightness-high'} />
                                <span className="d-none d-lg-inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                            </button>
                        </li>
                        {/* Social icons */}
                        <li className="nav-item d-none d-lg-flex align-items-center gap-1 ms-2">
                            <a href="#" aria-label="Twitter" className="nav-link px-2 opacity-75"><i className="bi bi-twitter-x" /></a>
                            <a href="#" aria-label="Instagram" className="nav-link px-2 opacity-75"><i className="bi bi-instagram" /></a>
                            <a href="#" aria-label="Facebook" className="nav-link px-2 opacity-75"><i className="bi bi-facebook" /></a>
                        </li>
                        {user ? (
                            <>
                                {/* Only agents can add advertisement (multi listing). Normal users manage profile only */}
                                {user.accountType === 'agent' && (
                                    <li className="nav-item d-none d-lg-block"><NavLink to="/dashboard" className="btn btn-sm btn-primary ms-lg-2">Add advertisement</NavLink></li>
                                )}
                                {/* Mobile-visible Logout (outside dropdown) */}
                                <li className="nav-item d-lg-none"><button className="nav-link btn btn-link px-2" onClick={logout}>Logout</button></li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="account" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span className="rounded-circle" style={{ width: 24, height: 24, backgroundImage: `url(${user.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed='+(user?.name||'U')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                        <span className="d-none d-lg-inline">Account</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="account">
                                        <li><NavLink className="dropdown-item" to="/dashboard">Dashboard</NavLink></li>
                                        {user.role === 'admin' && <li><NavLink className="dropdown-item" to="/admin">Admin</NavLink></li>}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                                    </ul>
                                </li>
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

