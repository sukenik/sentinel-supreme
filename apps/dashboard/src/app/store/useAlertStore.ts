import { eSeverity, iAlert } from '@sentinel-supreme/shared'
import { create } from 'zustand'

interface AlertState {
	alerts: iAlert[]
	stats: {
		criticalToday: number
		total24h: number
		activeRules: number
	}
	setAlerts: (alerts: iAlert[]) => void
	addAlert: (alert: iAlert) => void
	updateStats: (newStats: Partial<AlertState['stats']>) => void
}

export const useAlertStore = create<AlertState>((set) => ({
	alerts: [],
	stats: {
		criticalToday: 0,
		total24h: 0,
		activeRules: 0
	},
	setAlerts: (alerts) => set({ alerts }),
	addAlert: (alert) =>
		set((state) => ({
			alerts: (state.alerts.find(({ id }) => alert.id === id)
				? state.alerts
				: [alert, ...state.alerts]
			).slice(0, 100),
			stats: {
				...state.stats,
				criticalToday:
					alert.severity === eSeverity.CRITICAL
						? state.stats.criticalToday + 1
						: state.stats.criticalToday
			}
		})),
	updateStats: (newStats) =>
		set((state) => ({
			stats: { ...state.stats, ...newStats }
		}))
}))
