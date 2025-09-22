import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: false,
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err?.response?.status === 401) {
			localStorage.removeItem('token')
			localStorage.removeItem('user')
		}
		return Promise.reject(err)
	}
)

export default api

