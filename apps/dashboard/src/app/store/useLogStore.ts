import { create } from 'zustand'
import { iLog } from '@sentinel-supreme/shared'

interface LogState {
	logs: iLog[]
	addLog: (log: iLog) => void
	clearLogs: () => void
}

export const useLogStore = create<LogState>((set) => ({
	logs: [],
	addLog: (log) =>
		set((state) => ({
			logs: [log, ...state.logs].slice(0, 100)
		})),
	clearLogs: () => set({ logs: [] })
}))
