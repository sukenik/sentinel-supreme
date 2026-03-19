import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../consts'
import { useAuthStore } from '../store/useAuthStore'

interface iProps {
	children: ReactNode
}

const ProtectedRoute = ({ children }: iProps) => {
	const token = useAuthStore((state) => state.access_token)
	const location = useLocation()

	if (!token) {
		return <Navigate to={ROUTES.LOGIN_PAGE} state={{ from: location }} replace />
	}

	return children
}

export default ProtectedRoute
