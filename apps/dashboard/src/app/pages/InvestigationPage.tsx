import { eLogLevel, iLog } from '@sentinel-supreme/shared'
import { ChangeEvent, FC } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import { useLogsSearch } from '../hooks/useLogSearch'
import { getLevelColor } from '../utils'

const InvestigationPage: FC = () => {
	const { logs, loading, params, updateParams, stats, timeline, meta } = useLogsSearch()

	const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
		updateParams({ searchTerm: e.target.value })
	}

	const handleSourceIpChange = (e: ChangeEvent<HTMLInputElement>) => {
		updateParams({ sourceIp: e.target.value })
	}

	const handleLoadMoreClick = () => {
		if (!meta?.nextCursor || loading) return

		updateParams({ lastId: meta?.nextCursor })
	}

	return (
		<div className='p-6 bg-slate-900 h-full text-blue-100 flex flex-col border border-slate-800 rounded-xl'>
			<div className='flex flex-col mb-6'>
				<h1 className='text-3xl font-bold tracking-tight'>{'Forensic Investigation'}</h1>
				<div className='flex gap-3 mt-5'>
					<input
						type='text'
						value={params.searchTerm || ''}
						placeholder='Search logs content...'
						className='bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none w-64 transition-all'
						onChange={handleSearchTermChange}
					/>
					<input
						type='text'
						value={params.sourceIp || ''}
						placeholder='Filter by IP...'
						className='bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none w-40 transition-all'
						onChange={handleSourceIpChange}
					/>
				</div>
			</div>
			<div className='grid grid-cols-12 gap-4 mb-16 h-48'>
				<div className='col-span-9 bg-slate-800/40 border border-blue-900/50 rounded-lg p-4 backdrop-blur-sm relative overflow-hidden'>
					<h3 className='text-[10px] font-bold text-cyan-500 uppercase mb-2 tracking-[0.2em]'>
						{'Activity distribution (Hourly)'}
					</h3>
					<ResponsiveContainer width='100%' height='85%'>
						<AreaChart data={timeline}>
							<defs>
								<linearGradient id='colorCount' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor='#22d3ee' stopOpacity={0.3} />
									<stop offset='95%' stopColor='#22d3ee' stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#1e293b'
								vertical={false}
							/>
							<XAxis dataKey='time' hide={true} />
							<YAxis hide={true} domain={['auto', 'auto']} />
							<Tooltip
								contentStyle={{
									backgroundColor: '#0f172a',
									border: '1px solid #1e293b',
									borderRadius: '8px'
								}}
								labelStyle={{ color: '#94a3b8' }}
								itemStyle={{ color: '#22d3ee' }}
								labelFormatter={(label) => new Date(label).toLocaleString()}
							/>
							<Area
								type='monotone'
								dataKey='count'
								stroke='#22d3ee'
								strokeWidth={2}
								fillOpacity={1}
								fill='url(#colorCount)'
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
				<div className='col-span-3 flex flex-col gap-2'>
					<div className='flex-1 bg-slate-800/40 border border-red-900/30 p-3 rounded-lg flex flex-col justify-center'>
						<span className='text-[10px] text-red-400 font-bold uppercase'>
							{'Errors'}
						</span>
						<span className='text-2xl font-mono'>{stats?.[eLogLevel.ERROR] || 0}</span>
					</div>
					<div className='flex-1 bg-slate-800/40 border border-yellow-900/30 p-3 rounded-lg flex flex-col justify-center'>
						<span className='text-[10px] text-yellow-400 font-bold uppercase'>
							{'Warnings'}
						</span>
						<span className='text-2xl font-mono'>{stats?.[eLogLevel.WARN] || 0}</span>
					</div>
					<div className='flex-1 bg-slate-800/40 border border-blue-900/30 p-3 rounded-lg flex flex-col justify-center'>
						<span className='text-[10px] text-cyan-400 font-bold uppercase'>
							{'Total Hits'}
						</span>
						<span className='text-2xl font-mono'>{meta?.total || 0}</span>
					</div>
				</div>
			</div>
			<div className='flex-1 overflow-hidden border border-blue-900 rounded-lg bg-slate-800/50 backdrop-blur-sm flex flex-col'>
				<div className='overflow-y-auto flex-1 custom-scrollbar'>
					<table className='w-full text-left border-collapse'>
						<thead className='sticky top-0 z-10 bg-slate-800 shadow-md'>
							<tr className='bg-blue-900/30 text-cyan-300 uppercase text-xs tracking-widest'>
								<th className='px-6 py-4'>{'Timestamp'}</th>
								<th className='px-6 py-4'>{'Service'}</th>
								<th className='px-6 py-4'>{'Level'}</th>
								<th className='px-6 py-4'>{'Message'}</th>
								<th className='px-6 py-4'>{'Source IP'}</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-800'>
							{logs.map((log: iLog) => (
								<tr
									key={log.fingerprint}
									className='hover:bg-blue-900/10 transition-colors group text-sm'
								>
									<td className='px-6 py-4 text-slate-400 font-mono'>
										{log.createdAt
											? new Date(log.createdAt).toLocaleString()
											: 'Unknown'}
									</td>
									<td className='px-6 py-4'>
										<span className='bg-slate-900/80 px-2 py-1 rounded border border-slate-700 text-xs'>
											{log.service}
										</span>
									</td>
									<td className='px-6 py-4'>
										<span
											className={`px-2 py-1 rounded text-xs font-bold ${getLevelColor(log.level)}`}
										>
											{log.level}
										</span>
									</td>
									<td className='px-6 py-4 text-slate-300 italic max-w-md truncate'>
										{log.message}
									</td>
									<td className='px-6 py-4 font-mono text-cyan-400'>
										{log.sourceIp || '0.0.0.0'}
									</td>
								</tr>
							))}
							{loading && logs.length > 0 && (
								<tr>
									<td
										colSpan={5}
										className='p-4 text-center text-cyan-500 animate-pulse bg-slate-800/30'
									>
										{'Fetching older records from archives...'}
									</td>
								</tr>
							)}
							{loading && logs.length === 0 && (
								<tr>
									<td
										colSpan={5}
										className='p-12 text-center text-cyan-500 animate-pulse'
									>
										{'Scanning historical archives...'}
									</td>
								</tr>
							)}
							{!loading && !logs.length && (
								<tr>
									<td
										colSpan={5}
										className='p-12 text-center text-slate-500 italic'
									>
										{'No logs found matching the current params.'}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div
					onClick={handleLoadMoreClick}
					className={`p-4 border-t border-blue-900 flex justify-center bg-slate-800/50 ${!meta?.nextCursor || loading ? '' : 'cursor-pointer'}`}
				>
					<button
						disabled={!meta?.nextCursor || loading}
						className={`flex items-center gap-2 text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 transition-colors font-bold uppercase text-xs tracking-widest ${!meta?.nextCursor || loading ? '' : 'cursor-pointer'}`}
					>
						{loading
							? 'Decrypting more logs...'
							: meta?.nextCursor
								? 'Fetch Older Logs ↓'
								: 'We fetched all of them :)'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default InvestigationPage
