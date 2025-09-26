import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const navigate = useNavigate()
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function hydrate() {
			try {
				const storedToken = localStorage.getItem('token')
				const storedUser = localStorage.getItem('user')
				if (storedToken && storedUser) {
					setToken(storedToken)
					setUser(JSON.parse(storedUser))
				}
				// Also try to hydrate from cookie-based session if present
				if (!storedUser) {
					const { data } = await api.get('/auth/me')
					if (data?.user) {
						setUser(data.user)
					}
				}
			} catch {
				// ignore
			} finally {
				setLoading(false)
			}
		}
		hydrate()
	}, [])

	async function login(email, password) {
		const { data } = await api.post('/auth/login', { email, password })
		// Some backends return token+user, others only set cookie
		if (data?.token) {
			localStorage.setItem('token', data.token)
			setToken(data.token)
		}
		if (data?.user) {
			localStorage.setItem('user', JSON.stringify(data.user))
			setUser(data.user)
		} else {
			try {
				const me = await api.get('/auth/me')
				if (me.data?.user) {
					localStorage.setItem('user', JSON.stringify(me.data.user))
					setUser(me.data.user)
				}
			} catch {}
		}
		toast.success('Logged in')
		const role = (data?.user?.role) || 'user'
		if (role === 'admin') {
			navigate('/admin')
		} else {
			navigate('/')
		}
	}

	async function register(payload) {
		const { data } = await api.post('/auth/register', payload)
		if (data?.token) {
			localStorage.setItem('token', data.token)
			setToken(data.token)
		}
		if (data?.user) {
			localStorage.setItem('user', JSON.stringify(data.user))
			setUser(data.user)
		} else {
			try {
				const me = await api.get('/auth/me')
				if (me.data?.user) {
					localStorage.setItem('user', JSON.stringify(me.data.user))
					setUser(me.data.user)
				}
			} catch {}
		}
		toast.success('Account created')
		navigate('/')
	}

	function logout() {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		setToken(null)
		setUser(null)
		toast('Logged out')
		navigate('/')
	}

	const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading])
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	return useContext(AuthContext)
}

