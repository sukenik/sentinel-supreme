import { tRule } from '@sentinel-supreme/shared'
import { create } from 'zustand'
import api from '../api/axiosInstance'
import { GATEWAY_ROUTES } from '@sentinel-supreme/shared'

interface RuleState {
	rules: tRule[]
	isLoading: boolean
	fetchRules: () => Promise<void>
	addRule: (rule: Partial<tRule>) => Promise<void>
	updateRule: (id: string, updates: Partial<tRule>) => Promise<void>
	deleteRule: (id: string) => Promise<void>
}

export const useRuleStore = create<RuleState>((set, get) => ({
	rules: [],
	isLoading: false,

	fetchRules: async () => {
		set({ isLoading: true })
		try {
			const { data } = await api.get(GATEWAY_ROUTES.RULES)
			set({ rules: data.data })
		} finally {
			set({ isLoading: false })
		}
	},

	addRule: async (rule) => {
		const { data } = await api.post(`${GATEWAY_ROUTES.RULES}`, rule)
		set({ rules: [data.data, ...get().rules] })
	},

	updateRule: async (id, updates) => {
		Reflect.deleteProperty(updates, 'id')
		const { data } = await api.patch(`${GATEWAY_ROUTES.RULES}/${id}`, updates)
		set({ rules: get().rules.map((r) => (r.id === id ? data.data : r)) })
	},

	deleteRule: async (id) => {
		await api.delete(`${GATEWAY_ROUTES.RULES}/${id}`)
		set({ rules: get().rules.filter((r) => r.id !== id) })
	}
}))
