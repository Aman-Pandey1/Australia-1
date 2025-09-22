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
		try {
			const storedToken = localStorage.getItem('token')
			const storedUser = localStorage.getItem('user')
			if (storedToken && storedUser) {
				setToken(storedToken)
				setUser(JSON.parse(storedUser))
			}
		} finally {
			setLoading(false)
		}
	}, [])

	async function login(email, password) {
		const { data } = await api.post('/auth/login', { email, password })
		localStorage.setItem('token', data.token)
		localStorage.setItem('user', JSON.stringify(data.user))
		setToken(data.token)
		setUser(data.user)
		toast.success('Logged in')
    if (data.user?.role === 'admin') {
        navigate('/admin')
    } else {
        navigate('/')
    }
	}

	async function register(payload) {
		const { data } = await api.post('/auth/register', payload)
		localStorage.setItem('token', data.token)
		localStorage.setItem('user', JSON.stringify(data.user))
		setToken(data.token)
		setUser(data.user)
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

