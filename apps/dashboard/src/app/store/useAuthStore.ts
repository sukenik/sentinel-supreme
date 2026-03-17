import { iRequestUser } from '@sentinel-supreme/shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
	user: iRequestUser | null
	access_token: string | null
	setAuth: (user: iRequestUser, token: string) => void
	logout: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			access_token: null,
			setAuth: (user, access_token) => set({ user, access_token }),
			logout: () => set({ user: null, access_token: null })
		}),
		{
			name: 'auth-storage'
		}
	)
)
