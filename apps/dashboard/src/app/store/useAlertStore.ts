import { iAlert } from '@sentinel-supreme/shared'
import { create } from 'zustand'

interface AlertState {
	alerts: iAlert[]
	setAlerts: (alerts: iAlert[]) => void
	addAlert: (alert: iAlert) => void
	updateAlert: (id: string, updates: Partial<iAlert>) => void
}

export const useAlertStore = create<AlertState>((set) => ({
	alerts: [],
	setAlerts: (alerts) => set({ alerts }),
	addAlert: (alert) =>
		set((state) => {
			return {
				alerts: [alert, ...state.alerts].slice(0, 100)
			}
		}),
	updateAlert: (id: string, updates: Partial<iAlert>) => {
		set((state) => ({
			alerts: state.alerts.map((alert) =>
				alert.id === id ? { ...alert, ...updates } : alert
			)
		}))
	}
}))
