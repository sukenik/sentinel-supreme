import {
	eNotificationChannel,
	eSeverity,
	GATEWAY_ROUTES,
	iNotificationPreference
} from '@sentinel-supreme/shared'
import { FC, MouseEvent, useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import { useAuthStore } from '../store/useAuthStore'

const NotificationManager: FC = () => {
	const [prefs, setPrefs] = useState<iNotificationPreference[]>([])
	const [isGlobalMute, setIsGlobalMute] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const { user } = useAuthStore()

	const channels = [
		eNotificationChannel.EMAIL,
		eNotificationChannel.SLACK,
		eNotificationChannel.DISCORD
	]

	useEffect(() => {
		const init = async () => {
			setIsLoading(true)
			try {
				const [prefsRes, muteRes] = await Promise.all([
					api.get(GATEWAY_ROUTES.NOTIFICATIONS),
					api.get(`${GATEWAY_ROUTES.NOTIFICATIONS}/global-mute?userEmail=${user?.email}`)
				])
				setPrefs(prefsRes.data.data)
				setIsGlobalMute(muteRes.data.data.isMuted)
			} finally {
				setIsLoading(false)
			}
		}
		init()
	}, [user?.email])

	const handleGlobalMuteToggle = async () => {
		const newValue = !isGlobalMute
		setIsGlobalMute(newValue)

		try {
			await api.patch(`${GATEWAY_ROUTES.NOTIFICATIONS}${GATEWAY_ROUTES.GLOBAL_MUTE}`, {
				userEmail: user?.email,
				isMuted: newValue
			})
		} catch (error) {
			console.error('Failed to toggle global mute', error)
			setIsGlobalMute(!newValue)
		}
	}

	const handleToggle = async (e: MouseEvent) => {
		const [severity, channel] = e.currentTarget.id.split(',')
		const current = prefs.find((p) => p.severity === severity && p.channel === channel)
		const newValue = current ? !current.isEnabled : true

		try {
			const { data } = await api.patch(GATEWAY_ROUTES.NOTIFICATIONS, {
				userEmail: user?.email,
				severity,
				channel,
				isEnabled: newValue
			} as iNotificationPreference)

			setPrefs(data.data)
		} catch (error) {
			console.error('Failed to update preference', error)
		}
	}

	return (
		<div className='h-full flex flex-col animate-in fade-in slide-in-from-top-4 duration-300'>
			<div className='flex justify-between items-center mb-4 shrink-0'>
				<h3 className='text-xl font-bold text-cyan-400'>{'Notification Control Center'}</h3>
				<div className='flex flex-row gap-2'>
					<div className='text-right'>
						<p className='text-xs font-bold text-slate-300 uppercase'>
							{'Global Mute'}
						</p>
						<p className='text-xs text-slate-500'>{'Silence all channels'}</p>
					</div>
					<button
						onClick={handleGlobalMuteToggle}
						className={`w-12 h-6 rounded-full transition-all relative ${isGlobalMute ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-slate-600'} cursor-pointer`}
					>
						<div
							className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isGlobalMute ? 'left-7' : 'left-1'}`}
						/>
					</button>
				</div>
			</div>
			<div className='flex-1 min-h-0 border border-slate-700 rounded-xl bg-slate-800/30 backdrop-blur-sm flex flex-col overflow-hidden'>
				<div className='overflow-y-auto custom-scrollbar flex-1'>
					<table className='w-full text-left border-collapse'>
						<thead className='sticky top-0 z-10 bg-slate-800 shadow-md'>
							<tr className='text-slate-400 uppercase text-xs tracking-widest'>
								<th className='px-6 py-4'>{'Severity'}</th>
								{channels.map((c) => (
									<th key={c} className='px-6 py-4 text-center'>
										{c}
									</th>
								))}
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-800'>
							{[
								eSeverity.LOW,
								eSeverity.MEDIUM,
								eSeverity.HIGH,
								eSeverity.CRITICAL
							].map((sev) => (
								<tr key={sev} className='hover:bg-slate-700/20 transition-colors'>
									<td className='px-6 py-4 font-medium text-slate-200 capitalize'>
										{sev}
									</td>
									{isLoading ? (
										<td
											colSpan={channels.length}
											className='p-4 text-center animate-pulse text-slate-500'
										>
											{'Loading...'}
										</td>
									) : (
										channels.map((chan) => {
											const isEnabled = prefs.find(
												(p) => p.severity === sev && p.channel === chan
											)?.isEnabled
											return (
												<td key={chan} className='px-6 py-4 text-center'>
													<button
														onClick={handleToggle}
														id={`${sev},${chan}`}
														disabled={isGlobalMute}
														className={`w-12 h-6 rounded-full transition-all relative ${isGlobalMute ? 'opacity-30 cursor-not-allowed bg-slate-700' : `cursor-pointer ${isEnabled ? 'bg-cyan-500' : 'bg-slate-600'}`}`}
													>
														<div
															className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEnabled ? 'left-7' : 'left-1'}`}
														/>
													</button>
												</td>
											)
										})
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default NotificationManager
