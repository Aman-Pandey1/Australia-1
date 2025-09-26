import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth()
    if (loading) return null
    if (!user) return <Navigate to="/login" replace />
    // Normalize roles: allow 'agent' wherever 'user' is allowed
    if (roles && roles.length) {
        const userRole = user.role
        const effectiveRoles = new Set(roles)
        if (effectiveRoles.has('user')) effectiveRoles.add('agent')
        if (!effectiveRoles.has(userRole)) return <Navigate to="/" replace />
    }
    return children
}

