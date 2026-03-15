import { eLogLevel } from '@sentinel-supreme/shared'
import React from 'react'
import { useLogsSocket } from '../hooks/useLogsSocket'

export const LogLiveList: React.FC = () => {
	const { logs, isConnected } = useLogsSocket()

	return (
		<div className='p-6 bg-slate-900 min-h-screen text-blue-100'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold tracking-wider text-cyan-400'>
					{'LIVE SECURITY FEED'}
				</h1>
				<div className='flex items-center gap-2'>
					<span
						className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
					></span>
					<span className='text-sm uppercase'>
						{isConnected ? 'System Online' : 'System Offline'}
					</span>
				</div>
			</div>

			<div className='overflow-hidden border border-blue-900 rounded-lg bg-slate-800/50 backdrop-blur-sm'>
				<table className='w-full text-left border-collapse'>
					<thead>
						<tr className='bg-blue-900/30 text-cyan-300 uppercase text-xs tracking-widest'>
							<th className='p-4 border-b border-blue-800'>Time</th>
							<th className='p-4 border-b border-blue-800'>Service</th>
							<th className='p-4 border-b border-blue-800'>Level</th>
							<th className='p-4 border-b border-blue-800'>Message</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-blue-900/50 font-mono text-sm'>
						{logs.map((log, index) => (
							<tr
								key={log.fingerprint || index}
								className='hover:bg-blue-500/10 transition-colors'
							>
								<td className='p-4 text-slate-400'>
									{new Date(log.createdAt || Date.now()).toLocaleTimeString()}
								</td>
								<td className='p-4 font-semibold text-blue-300'>{log.service}</td>
								<td className='p-4'>
									<span
										className={`px-2 py-1 rounded text-xs font-bold ${
											log.level === eLogLevel.ERROR
												? 'bg-red-900/40 text-red-400'
												: log.level === eLogLevel.WARN
													? 'bg-yellow-900/40 text-yellow-400'
													: 'bg-green-900/40 text-green-400'
										}`}
									>
										{log.level.toUpperCase()}
									</span>
								</td>
								<td className='p-4 truncate max-w-md'>{log.message}</td>
							</tr>
						))}
						{!logs.length && (
							<tr>
								<td colSpan={4} className='p-10 text-center text-slate-500 italic'>
									{'Waiting for incoming logs...'}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
