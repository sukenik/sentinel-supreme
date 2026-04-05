import { ChangeEvent, FC } from 'react'
import { useLogsSearch } from '../hooks/useLogSearch'
import { getLevelColor } from '../utils'

const InvestigationPage: FC = () => {
	const { logs, loading, params, updateParams, meta } = useLogsSearch()

	const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
		updateParams({ searchTerm: e.target.value })
	}

	const handleSourceIpChange = (e: ChangeEvent<HTMLInputElement>) => {
		updateParams({ sourceIp: e.target.value })
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
							{loading ? (
								<tr>
									<td
										colSpan={5}
										className='p-12 text-center text-cyan-500 animate-pulse'
									>
										{'Scanning historical archives...'}
									</td>
								</tr>
							) : (
								logs.map((log: any) => (
									<tr
										key={log.fingerprint}
										className='hover:bg-blue-900/10 transition-colors group text-sm'
									>
										<td className='px-6 py-4 text-slate-400 font-mono'>
											{new Date(log.createdAt).toLocaleString()}
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
								))
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
				<div className='bg-slate-800/80 p-3 border-t border-blue-900 flex justify-between items-center text-xs text-slate-500'>
					<span>{`Showing ${logs.length} logs`}</span>
					<span>{`Total found: ${meta.total}`}</span>
				</div>
			</div>
		</div>
	)
}

export default InvestigationPage
