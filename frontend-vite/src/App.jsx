import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
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
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
					<Route path="/admin" element={<ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>} />
				</Routes>
			</AppLayout>
		</AuthProvider>
	)
}
