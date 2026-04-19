import { eSeverity, iAlert } from '@sentinel-supreme/shared'
import { BrainCircuit, ChevronDown, ChevronRight, Clock, Network } from 'lucide-react'
import { ChangeEvent, FC, Fragment, MouseEvent, useMemo, useState } from 'react'
import { eMenuOptions } from '../consts'
import { useMenuStore } from '../store/useMenuStore'

interface iProps {
	alerts: iAlert[]
}

const AlertsTable: FC<iProps> = ({ alerts }) => {
	const [selectedSeverity, setSelectedSeverity] = useState(eSeverity.ALL)
	const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null)
	const setOpenOption = useMenuStore((state) => state.setOpenOption)

	const handleToggleRow = (e: MouseEvent) => {
		const alertId = e.currentTarget.id
		setExpandedAlertId(expandedAlertId === alertId ? null : alertId)
	}

	const handleInvestigateClick = (e: MouseEvent) => {
		e.stopPropagation()
		const logSourceIp = e.currentTarget.id
		setOpenOption(eMenuOptions.INVESTIGATION, logSourceIp)
	}

	const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedSeverity(e.target.value as eSeverity)
	}

	const filteredAlerts = useMemo(() => {
		if (selectedSeverity === eSeverity.ALL) return alerts
		return alerts.filter((alert) => alert.severity === selectedSeverity)
	}, [alerts, selectedSeverity])

	return (
		<div className='flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col'>
			<div className='p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50'>
				<h2 className='text-xl font-semibold text-white'>
					{'High-Priority Security Alerts'}
				</h2>
				<div className='flex gap-2'>
					<select
						value={selectedSeverity}
						onChange={handleFilterChange}
						className='bg-slate-800 border border-slate-700 text-sm rounded px-3 py-1 outline-none focus:border-cyan-500 text-slate-200 cursor-pointer'
					>
						{Object.values(eSeverity).map((severity) => (
							<option key={severity} value={severity}>
								{severity}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className='flex-1 overflow-auto custom-scrollbar'>
				<table className='w-full text-left border-collapse'>
					<thead className='sticky top-0 z-10 bg-slate-800 shadow-sm'>
						<tr className='text-slate-400 uppercase text-xs tracking-wider'>
							<th className='p-4 w-10' />
							<th className='p-4 font-medium'>{'Severity'}</th>
							<th className='p-4 font-medium'>{'Alert Type'}</th>
							<th className='p-4 font-medium'>{'Trigger Time'}</th>
							<th className='p-4 font-medium'>{'Source IP'}</th>
							<th className='p-4 font-medium text-right'>{'Actions'}</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-slate-800 font-sans'>
						{filteredAlerts.map((alert) => (
							<Fragment key={alert.id}>
								<tr
									id={alert.id}
									onClick={handleToggleRow}
									className={`hover:bg-slate-800/40 transition-colors ${expandedAlertId === alert.id ? 'bg-slate-800/60' : ''}`}
								>
									<td className='p-4 text-slate-500 cursor-pointer'>
										{expandedAlertId === alert.id ? (
											<ChevronDown size={18} />
										) : (
											<ChevronRight size={18} />
										)}
									</td>
									<td className='p-4'>
										<span
											className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
												alert.severity === eSeverity.CRITICAL
													? 'bg-red-500/20 text-red-500 border border-red-500/50'
													: alert.severity === eSeverity.HIGH
														? 'bg-orange-500/20 text-orange-500 border border-orange-500/50'
														: 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
											}`}
										>
											{alert.severity}
										</span>
									</td>
									<td className='p-4 font-medium text-slate-200'>
										{alert.ruleName}
									</td>
									<td className='p-4 text-slate-400 text-sm'>
										{new Date(alert.createdAt).toLocaleTimeString()}
									</td>
									<td className='p-4 font-mono text-sm text-blue-300'>
										{alert.logSourceIp || 'N/A'}
									</td>
									<td className='p-4 text-right'>
										<button
											id={alert.logSourceIp}
											onClick={handleInvestigateClick}
											className='text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition cursor-pointer font-bold'
										>
											{'Investigate'}
										</button>
									</td>
								</tr>
								{expandedAlertId === alert.id && (
									<tr className='bg-slate-900/80 animate-in fade-in slide-in-from-top-2 duration-200'>
										<td colSpan={6} className='p-0'>
											<div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
												<div className='md:col-span-2 space-y-3'>
													<div className='flex items-center gap-2 text-cyan-400 font-semibold text-sm uppercase tracking-wider'>
														<BrainCircuit size={18} />
														{'AI Analysis & Insights'}
													</div>
													<div className='bg-slate-950/50 border border-slate-800 rounded-lg p-4 min-h-30 max-h-62.5 overflow-y-auto custom-scrollbar'>
														{alert.aiInsight ? (
															<div className='text-slate-300 text-sm leading-relaxed whitespace-pre-wrap'>
																{alert.aiInsight}
															</div>
														) : (
															<div className='flex flex-col items-center justify-center h-full gap-3 text-slate-500 italic text-sm'>
																<div className='w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin' />
																{'AI is crunching the logs...'}
															</div>
														)}
													</div>
												</div>

												<div className='space-y-4 text-sm border-l border-slate-800 pl-6'>
													<div className='text-slate-400 font-medium uppercase text-xs'>
														{'Alert Context'}
													</div>
													<div className='space-y-3'>
														<div className='flex items-center gap-3'>
															<Clock
																size={14}
																className='text-slate-500'
															/>
															<span className='text-slate-400'>
																{'Triggered:'}
															</span>
															<span className='text-slate-200'>
																{new Date(
																	alert.createdAt
																).toLocaleString()}
															</span>
														</div>
														<div className='flex items-center gap-3'>
															<Network
																size={14}
																className='text-slate-500'
															/>
															<span className='text-slate-400'>
																{'Source:'}
															</span>
															<span className='text-slate-200 font-mono'>
																{alert.logSourceIp}
															</span>
														</div>
														<div className='p-3 bg-red-500/5 rounded-md border border-red-500/10'>
															<p className='text-xs text-slate-400 mb-1'>
																{'Raw Message:'}
															</p>
															<p className='text-xs text-red-200/70 italic'>
																{`"{alert.message}"`}
															</p>
														</div>
													</div>
												</div>
											</div>
										</td>
									</tr>
								)}
							</Fragment>
						))}
						{!filteredAlerts.length && (
							<tr>
								<td colSpan={5} className='p-12 text-center text-slate-500 italic'>
									{selectedSeverity === eSeverity.ALL
										? 'No threats detected. System is secure.'
										: `No ${selectedSeverity} severity alerts found.`}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default AlertsTable
