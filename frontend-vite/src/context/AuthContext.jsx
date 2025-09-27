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
				// Also try to hydrate from cookie-based session if present or when stored user is missing fields
				let needsRefresh = true
				try {
					const u = storedUser ? JSON.parse(storedUser) : null
					needsRefresh = !u || !u.accountType
				} catch { needsRefresh = true }
				if (needsRefresh) {
					const { data } = await api.get('/auth/me')
					if (data?.user) {
						localStorage.setItem('user', JSON.stringify(data.user))
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

    function beforeUnload(e) {
        if (localStorage.getItem('user')) {
            e.preventDefault()
            e.returnValue = ''
        }
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
	}, [])

    async function login(email, password) {
        try {
			const { data } = await api.post('/auth/login', { email, password })
			// Some backends return token+user, others only set cookie
			if (data?.token) {
				localStorage.setItem('token', data.token)
				setToken(data.token)
			}
			if (data?.user) {
				localStorage.setItem('user', JSON.stringify(data.user))
				setUser(data.user)
			}
			// Ensure we have freshest user with accountType
			let effectiveUser = data?.user || null
			try {
				const me = await api.get('/auth/me')
				if (me.data?.user) {
					effectiveUser = me.data.user
					localStorage.setItem('user', JSON.stringify(effectiveUser))
					setUser(effectiveUser)
				}
			} catch {}
			toast.success('Logged in')
			const role = ((effectiveUser?.role) || 'user').toLowerCase()
			if (role === 'admin') {
				navigate('/admin')
			} else {
				navigate('/dashboard')
			}
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Login failed'
            toast.error(msg)
            throw err
        }
    }

	async function register(payload) {
        try {
			const { data } = await api.post('/auth/register', payload)
			if (data?.token) {
				localStorage.setItem('token', data.token)
				setToken(data.token)
			}
			if (data?.user) {
				localStorage.setItem('user', JSON.stringify(data.user))
				setUser(data.user)
			}
			// Ensure freshest user and accountType
			let effectiveUser = data?.user || null
			if (!effectiveUser || !effectiveUser.accountType) {
				try {
					const me = await api.get('/auth/me')
					if (me.data?.user) {
						effectiveUser = me.data.user
						localStorage.setItem('user', JSON.stringify(effectiveUser))
						setUser(effectiveUser)
					}
				} catch {}
			}
			toast.success('Account created')
			const role = ((effectiveUser?.role) || 'user').toLowerCase()
			if (role === 'admin') {
				navigate('/admin')
			} else {
				navigate('/dashboard')
			}
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Registration failed'
            toast.error(msg)
            throw err
        }
    }

	async function logout() {
		try { await api.post('/auth/logout') } catch {}
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

