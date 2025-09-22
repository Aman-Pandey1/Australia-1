import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import City from './pages/City'
import Category from './pages/Category'
import Admin from './pages/Admin'
import Dashboard from './pages/Dashboard'
import { Login, Register } from './pages/Auth'

function AppLayout({ children }) {
	return (
		<div>
			<Navbar />
			<main>{children}</main>
		</div>
	)
}

export default function App() {
	return (
		<AuthProvider>
			<AppLayout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/blogs" element={<Blogs />} />
					<Route path="/blogs/:slug" element={<BlogDetail />} />
					<Route path="/city/:city" element={<City />} />
					<Route path="/category/:slug" element={<Category />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
					<Route path="/admin" element={<ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>} />
				</Routes>
			</AppLayout>
		</AuthProvider>
	)
}
