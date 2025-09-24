import { Link } from 'react-router-dom'

export default function Topbar() {
    return (
        <div className="topbar">
            <div className="container d-flex align-items-center justify-content-between py-1">
                <div className="d-none d-md-flex gap-3 small">
                    <Link to="/city/Sydney" className="link-light text-decoration-none opacity-75">Browse by city</Link>
                    <span className="opacity-25">|</span>
                    <Link to="/blogs" className="link-light text-decoration-none opacity-75">Pricing</Link>
                    <Link to="/blogs" className="link-light text-decoration-none opacity-75">News</Link>
                </div>
                <div className="ms-auto d-flex align-items-center gap-2 small">
                    <Link to="/login" className="link-light text-decoration-none">Login</Link>
                    <Link to="/register" className="btn btn-sm btn-primary">Add advertisement</Link>
                </div>
            </div>
        </div>
    )
}

