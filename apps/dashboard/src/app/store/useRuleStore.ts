import { GATEWAY_ROUTES, tRule } from '@sentinel-supreme/shared'
import { create } from 'zustand'
import api from '../api/axiosInstance'

interface RuleState {
	rules: tRule[]
	isLoading: boolean
	fetchRules: () => Promise<tRule[]>
	addRule: (rule: Partial<tRule>) => Promise<void>
	updateRule: (id: string, updates: Partial<tRule>) => Promise<void>
	deleteRule: (id: string) => Promise<void>
}

export const useRuleStore = create<RuleState>((set, get) => ({
	rules: [],
	isLoading: false,
	fetchRules: async () => {
		let rulesRes
		set({ isLoading: true })

		try {
			rulesRes = await api.get(GATEWAY_ROUTES.RULES)
			set({ rules: rulesRes.data.data })
		} finally {
			set({ isLoading: false })
		}

		return rulesRes?.data.data || []
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
