import { eSeverity, iAlert } from '@sentinel-supreme/shared'
import { ChangeEvent, FC, MouseEvent, useMemo, useState } from 'react'
import AlertRow from './AlertRow'

interface iProps {
	alerts: iAlert[]
}

const AlertTable: FC<iProps> = ({ alerts }) => {
	const [selectedSeverity, setSelectedSeverity] = useState(eSeverity.ALL)
	const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null)

	const handleToggleRow = (e: MouseEvent) => {
		const alertId = e.currentTarget.id
		setExpandedAlertId(expandedAlertId === alertId ? null : alertId)
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
							<th className='p-4 font-medium'>{'Rule Name'}</th>
							<th className='p-4 font-medium'>{'Trigger Time'}</th>
							<th className='p-4 font-medium'>{'Source IP'}</th>
							<th className='p-4 font-medium text-right'>{'Actions'}</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-slate-800 font-sans'>
						{filteredAlerts.map((alert) => (
							<AlertRow
								key={alert.id}
								alert={alert}
								isExpanded={expandedAlertId === alert.id}
								handleToggleRow={handleToggleRow}
							/>
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

export default AlertTable
