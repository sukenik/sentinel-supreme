import { FC } from 'react'
import { useLogStore } from '../store/useLogStore'
import { getLevelColor } from '../utils'

interface iProps {
	isConnected: boolean
}

const LiveLogList: FC<iProps> = ({ isConnected }) => {
	const logs = useLogStore((state) => state.logs)

	return (
		<div className='p-6 bg-slate-900 h-full text-blue-100 flex flex-col border border-slate-800 rounded-xl'>
			<div className='flex justify-between items-center mb-6 shrink-0 h-10'>
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
			<div className='flex-1 overflow-hidden border border-blue-900 rounded-lg bg-slate-800/50 backdrop-blur-sm flex flex-col'>
				<div className='overflow-y-auto custom-scrollbar flex-1'>
					<table className='w-full text-left border-collapse'>
						<thead className='sticky top-0 z-10 bg-slate-800 shadow-md'>
							<tr className='bg-blue-900/30 text-cyan-300 uppercase text-xs tracking-widest'>
								<th className='p-4 border-b border-blue-800'>{'Time'}</th>
								<th className='p-4 border-b border-blue-800'>{'Service'}</th>
								<th className='p-4 border-b border-blue-800'>{'Level'}</th>
								<th className='p-4 border-b border-blue-800'>{'Message'}</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-blue-900/50 font-mono text-sm'>
							{logs.map((log, index) => (
								<tr
									key={log.fingerprint || index}
									className='hover:bg-blue-500/10 transition-colors border-blue-900/20'
								>
									<td className='p-4 text-slate-400 whitespace-nowrap'>
										{new Date(log.createdAt || Date.now()).toLocaleTimeString()}
									</td>
									<td className='p-4 font-semibold text-blue-300'>
										{log.service}
									</td>
									<td className='p-4'>
										<span
											className={`px-2 py-1 rounded text-xs font-bold ${getLevelColor(log.level)}`}
										>
											{log.level.toUpperCase()}
										</span>
									</td>
									<td className='p-4 break-all max-w-md'>{log.message}</td>
								</tr>
							))}
							{!logs.length && (
								<tr>
									<td
										colSpan={4}
										className='p-10 text-center text-slate-500 italic'
									>
										{'Waiting for incoming logs...'}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default LiveLogList
