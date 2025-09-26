import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Topbar from './components/Topbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Listing from './pages/Listing'
import About from './pages/About'
import Contact from './pages/Contact'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import City from './pages/City'
import Category from './pages/Category'
import Admin from './pages/Admin'
import Dashboard from './pages/Dashboard'
import { Login, Register } from './pages/Auth'
import AdminUsers from './pages/admin/Users'
import AdminListings from './pages/admin/Listings'
import AdminAds from './pages/admin/Ads'
import AdminReviews from './pages/admin/Reviews'
import AdminComments from './pages/admin/Comments'
import AdminReports from './pages/admin/Reports'
import AdminSubscriptions from './pages/admin/Subscriptions'

function AppLayout({ children }) {
	return (
		<div>
            <Topbar />
			<Navbar />
			<main>{children}</main>
            <Footer />
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
                    <Route path="/l/:slug" element={<Listing />} />
					<Route path="/city/:city" element={<City />} />
					<Route path="/category/:slug" element={<Category />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
					<Route path="/admin" element={<ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsers /></ProtectedRoute>} />
                    <Route path="/admin/listings" element={<ProtectedRoute roles={["admin"]}><AdminListings /></ProtectedRoute>} />
                    <Route path="/admin/ads" element={<ProtectedRoute roles={["admin"]}><AdminAds /></ProtectedRoute>} />
                    <Route path="/admin/reviews" element={<ProtectedRoute roles={["admin"]}><AdminReviews /></ProtectedRoute>} />
                    <Route path="/admin/comments" element={<ProtectedRoute roles={["admin"]}><AdminComments /></ProtectedRoute>} />
                    <Route path="/admin/reports" element={<ProtectedRoute roles={["admin"]}><AdminReports /></ProtectedRoute>} />
                    <Route path="/admin/subscriptions" element={<ProtectedRoute roles={["admin"]}><AdminSubscriptions /></ProtectedRoute>} />
					</Routes>
			</AppLayout>
		</AuthProvider>
	)
}
