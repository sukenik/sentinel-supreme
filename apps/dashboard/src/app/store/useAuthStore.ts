import { iRequestUser } from '@sentinel-supreme/shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
	access_token: string | null
	user: iRequestUser | null
	setAuth: (access_token: string, user: iRequestUser) => void
	logout: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			access_token: null,
			user: null,
			setAuth: (access_token, user) => set({ access_token, user }),
			logout: () => set({ user: null, access_token: null })
		}),
		{
			name: 'auth-storage'
		}
	)
)
