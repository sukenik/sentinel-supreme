import { eLogLevel, eUserRole, iUser } from '@sentinel-supreme/shared'
import DashboardView from './components/DashboardView'
import { eMenuOptions } from './consts'
import MachinesPage from './pages/MachinesPage'
import SettingsPage from './pages/SettingsPage'
import { useAuthStore } from './store/useAuthStore'

export const getLevelColor = (level: eLogLevel) => {
	switch (level.toLowerCase()) {
		case eLogLevel.ERROR:
			return 'bg-red-900/40 text-red-400'
		case eLogLevel.WARN:
			return 'bg-yellow-900/40 text-yellow-400'
		case eLogLevel.DEBUG:
			return 'bg-purple-900/40 text-purple-400'
		default:
			return 'bg-green-900/40 text-green-400'
	}
}

export const useMenuOptionsByRole = () => {
	const role = useAuthStore().user?.role
	const options = [eMenuOptions.DASHBOARD]

	if (role === eUserRole.ADMIN) {
		return options.concat([eMenuOptions.MACHINES, eMenuOptions.SETTINGS])
	}

	return options
}

export const getComponentByMenuOption = (option: eMenuOptions) => {
	switch (option) {
		case eMenuOptions.DASHBOARD:
			return DashboardView
		case eMenuOptions.MACHINES:
			return MachinesPage
		case eMenuOptions.SETTINGS:
			return SettingsPage
		default:
			return DashboardView
	}
}

export const getStyleByRole = (role: eUserRole, isEditMode: boolean) =>
	role === eUserRole.ADMIN
		? `bg-purple-500/20 text-purple-400 ${isEditMode ? 'hover:bg-purple-500/40 cursor-pointer' : ''}`
		: `bg-blue-500/20 text-blue-400 ${isEditMode ? 'hover:bg-blue-500/40 cursor-pointer' : ''}`

export const getErrorMsg = (
	id: string,
	email: string,
	password: string,
	role: eUserRole,
	users: iUser[],
	isAdding: boolean
): string => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (!emailRegex.test(email)) {
		return 'Invalid email format'
	}

	const isEmailInUse = users.some(
		(user) => user.email.toLowerCase() === email.toLowerCase() && user.id !== id
	)

	if (isEmailInUse) {
		return 'Email already in use'
	}

	if (role !== eUserRole.ADMIN && users.length === 1 && !isAdding) {
		return 'There must be at least one admin'
	}

	const passwordErrMsg = 'Password must be at least 8 characters long'

	if (isAdding) {
		if (!password) {
			return passwordErrMsg
		}
	}

	if (password.length && password?.length < 8) {
		return passwordErrMsg
	}

	return ''
}
