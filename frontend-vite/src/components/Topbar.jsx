import { Link } from 'react-router-dom'

export default function Topbar() {
    return (
        <div className="topbar">
            <div className="container d-flex align-items-center justify-content-between py-1">
                <div className="d-none d-md-flex gap-3 small align-items-center">
                    <Link to="/" className="link-light text-decoration-none opacity-75">Home</Link>
                    <Link to="/about" className="link-light text-decoration-none opacity-75">About</Link>
                    <Link to="/blogs" className="link-light text-decoration-none opacity-75">Blog</Link>
                    <Link to="/contact" className="link-light text-decoration-none opacity-75">Contact</Link>
                </div>
                <div className="ms-auto d-flex align-items-center gap-3 small">
                    <div className="d-none d-md-flex align-items-center gap-2 opacity-75">
                        <a href="#" aria-label="Twitter" className="text-decoration-none text-light"><i className="bi bi-twitter-x" /></a>
                        <a href="#" aria-label="Instagram" className="text-decoration-none text-light"><i className="bi bi-instagram" /></a>
                        <a href="#" aria-label="Facebook" className="text-decoration-none text-light"><i className="bi bi-facebook" /></a>
                    </div>
                    <Link to="/login" className="link-light text-decoration-none">Login</Link>
                    <Link to="/register" className="btn btn-sm btn-primary">Add advertisement</Link>
                </div>
            </div>
        </div>
    )
}

