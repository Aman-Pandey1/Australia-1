import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer mt-5 pt-5 pb-4">
            <div className="container">
                <div className="row g-4">
                    <div className="col-12 col-md-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div className="fw-bold fs-4 text-white">escortify</div>
                        </div>
                        <div className="small">Escortify® - Better Technology, Smarter Escorts</div>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="text-white fw-semibold mb-2">About & help</div>
                        <ul className="list-unstyled small">
                            <li><Link to="/blogs" className="link-light text-decoration-none">Pricing</Link></li>
                            <li><Link to="/about" className="link-light text-decoration-none">About us</Link></li>
                            <li><Link to="/contact" className="link-light text-decoration-none">Advertising process</Link></li>
                            <li><Link to="/blogs" className="link-light text-decoration-none">News & updates</Link></li>
                            <li><Link to="/" className="link-light text-decoration-none">Safety policy</Link></li>
                            <li><Link to="/" className="link-light text-decoration-none">Site map</Link></li>
                            <li><Link to="/contact" className="link-light text-decoration-none">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="text-white fw-semibold mb-2">Popular cities</div>
                        <ul className="list-unstyled small two-col">
                            {['Sydney','Melbourne','Brisbane','Perth','Adelaide','Gold Coast','Canberra','Newcastle','Hobart'].map((c) => (
                                <li key={c}><Link to={`/city/${encodeURIComponent(c)}`} className="link-light text-decoration-none">{c} escorts</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-4 small text-secondary">© 2015–2025 Escortify.com.au</div>
            </div>
        </footer>
    )
}

