import { FC } from 'react'
import { eSeverity, iAlert } from '@sentinel-supreme/shared'

interface iProps {
	alerts: iAlert[]
}

const AlertsTable: FC<iProps> = ({ alerts }) => {
	return (
		<div className='flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col'>
			<div className='p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50'>
				<h2 className='text-xl font-semibold text-white'>High-Priority Security Alerts</h2>
				<div className='flex gap-2'>
					<select className='bg-slate-800 border border-slate-700 text-sm rounded px-3 py-1 outline-none focus:border-accent'>
						<option>Filter by Severity</option>
						<option>Critical</option>
						<option>High</option>
					</select>
				</div>
			</div>

			<div className='flex-1 overflow-auto custom-scrollbar'>
				<table className='w-full text-left border-collapse'>
					<thead className='sticky top-0 z-10 bg-slate-800 shadow-sm'>
						<tr className='text-slate-400 uppercase text-xs tracking-wider'>
							<th className='p-4 font-medium'>{'Severity'}</th>
							<th className='p-4 font-medium'>{'Alert Type'}</th>
							<th className='p-4 font-medium'>{'Trigger Time'}</th>
							<th className='p-4 font-medium'>{'Source IP'}</th>
							<th className='p-4 font-medium text-right'>{'Actions'}</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-slate-800 font-sans'>
						{alerts.map((alert) => (
							<tr key={alert.id} className='hover:bg-slate-800/40 transition-colors'>
								<td className='p-4'>
									<span
										className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
											alert.severity === eSeverity.CRITICAL
												? 'bg-red-500/20 text-red-500 border border-red-500/50'
												: 'bg-orange-500/20 text-orange-500 border border-orange-500/50'
										}`}
									>
										{alert.severity}
									</span>
								</td>
								<td className='p-4 font-medium text-slate-200'>{alert.ruleName}</td>
								<td className='p-4 text-slate-400 text-sm'>
									{new Date(alert.createdAt).toLocaleTimeString()}
								</td>
								<td className='p-4 font-mono text-sm text-blue-300'>
									{alert.logSourceIp || 'N/A'}
								</td>
								<td className='p-4 text-right'>
									<button className='text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition'>
										{'Investigate'}
									</button>
								</td>
							</tr>
						))}
						{!alerts.length && (
							<tr>
								<td colSpan={5} className='p-12 text-center text-slate-500 italic'>
									{'No critical threats detected. System is secure.'}
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
