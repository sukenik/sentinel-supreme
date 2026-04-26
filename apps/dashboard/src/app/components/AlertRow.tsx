import { eSeverity, iAlert } from '@sentinel-supreme/shared'
import { BrainCircuit, ChevronRight, Clock, Fingerprint, Network } from 'lucide-react'
import { FC, MouseEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { eMenuOptions } from '../consts'
import { useMenuStore } from '../store/useMenuStore'
import Tooltip from './Tooltip'

interface iProps {
	alert: iAlert
	isExpanded: boolean
	handleToggleRow: (e: MouseEvent) => void
}

const AlertRow: FC<iProps> = ({ alert, isExpanded, handleToggleRow }) => {
	const setOpenOption = useMenuStore((state) => state.setOpenOption)

	const handleInvestigateClick = (e: MouseEvent) => {
		e.stopPropagation()
		setOpenOption(eMenuOptions.INVESTIGATION, alert.logSourceIp || '')
	}

	return (
		<>
			<tr
				id={alert.id}
				onClick={handleToggleRow}
				className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-800/60' : ''}`}
			>
				<td className='p-4 text-slate-500'>
					<div
						className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
					>
						<ChevronRight size={18} />
					</div>
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
				<td className='p-4 font-medium text-slate-200 flex gap-2'>
					{alert.ruleName}
					{alert.aiInsight?.similarPatterns && (
						<Tooltip text='Similar patterns detected in history'>
							<Fingerprint size={14} className='text-orange-500' />
						</Tooltip>
					)}
				</td>
				<td className='p-4 text-slate-400 text-sm'>
					{new Date(alert.createdAt).toLocaleTimeString()}
				</td>
				<td className='p-4 font-mono text-sm text-blue-300'>
					{alert.logSourceIp || 'N/A'}
				</td>
				<td className='p-4 text-right'>
					<button
						onClick={handleInvestigateClick}
						className='text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition cursor-pointer font-bold'
					>
						{'Investigate'}
					</button>
				</td>
			</tr>
			<tr className={`bg-slate-900/80 border-b border-slate-800`}>
				<td colSpan={6} className='p-0 overflow-hidden'>
					<div className={`grid-rows-collapse ${isExpanded ? 'grid-rows-expand' : ''}`}>
						<div className='min-h-0 overflow-hidden'>
							<div
								className={`p-6 grid grid-cols-1 md:grid-cols-3 gap-6 ${
									isExpanded ? 'animate-slide-in-top' : 'animate-slide-out-top'
								}`}
							>
								<div className='md:col-span-2 space-y-3'>
									<div className='flex items-center gap-2 text-cyan-400 font-semibold text-sm uppercase tracking-wider'>
										<BrainCircuit size={18} />
										{'AI Analysis & Insights'}
									</div>
									<div className='bg-slate-950/50 border border-slate-800 rounded-lg p-4 min-h-32 max-h-64 overflow-y-auto custom-scrollbar'>
										{alert.aiInsight ? (
											<div className='space-y-4'>
												<div className='text-slate-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-none'>
													<ReactMarkdown
														components={{
															h3: ({ node, ...props }) => (
																<h3
																	className='text-cyan-400 font-bold mt-4 mb-2 uppercase tracking-tight'
																	{...props}
																/>
															),
															strong: ({ node, ...props }) => (
																<strong
																	className='text-white font-semibold'
																	{...props}
																/>
															),
															ul: ({ node, ...props }) => (
																<ul
																	className='list-disc list-inside space-y-1 text-slate-400'
																	{...props}
																/>
															),
															hr: ({ node, ...props }) => (
																<hr
																	className='border-slate-800 my-4'
																	{...props}
																/>
															)
														}}
													>
														{alert.aiInsight.content}
													</ReactMarkdown>
												</div>
												<div className='flex items-center gap-4 pt-3 border-t border-slate-800/50 text-sm text-slate-500 font-mono'>
													<span className='bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20'>
														{`Tokens: ${alert.aiInsight.tokensUsed}`}
													</span>
													<span className='bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20'>
														{`Generated: ${new Date(alert.aiInsight.generatedAt).toLocaleTimeString()}`}
													</span>
													<span className='bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20'>
														{`Model: ${alert.aiInsight.model}`}
													</span>
												</div>
											</div>
										) : (
											<div className='flex flex-col items-center justify-center h-32 gap-3 text-slate-500 italic text-sm'>
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
										<div className='flex items-center gap-3 text-slate-300'>
											<Clock size={14} className='text-slate-500' />
											<span>{`Triggered: ${new Date(alert.createdAt).toLocaleString()}`}</span>
										</div>
										<div className='flex items-center gap-3 text-slate-300'>
											<Network size={14} className='text-slate-500' />
											<span>
												{'Source IP: '}
												<span className='font-mono'>
													{alert.logSourceIp}
												</span>
											</span>
										</div>
										<div className='p-3 bg-slate-950/50 rounded-md border border-slate-800'>
											<p className='text-xs text-slate-500 mb-1'>
												{'Raw Event Data:'}
											</p>
											<p className='text-xs text-slate-400 italic wrap-break-words'>
												{`"${alert.message}"`}
											</p>
										</div>
									</div>
									{alert.aiInsight?.similarPatterns && (
										<div className='mt-6 space-y-3'>
											<div className='flex items-center gap-2 text-orange-400 font-semibold text-[11px] uppercase tracking-wider'>
												<Fingerprint size={14} />
												{'Similar Patterns Found'}
											</div>

											<div className='space-y-2'>
												{alert.aiInsight.similarPatterns.map(
													(pattern, idx) => (
														<div
															key={idx}
															className='p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg group hover:bg-orange-500/10 transition-colors'
														>
															<div className='flex justify-between items-start mb-1'>
																<span className='text-[10px] font-bold text-orange-500/80 uppercase'>
																	{`Match: ${(
																		pattern.score * 100
																	).toFixed(0)}%`}
																</span>
															</div>
															<p className='text-xs text-slate-300 line-clamp-2 italic'>
																{`"${pattern.summary}"`}
															</p>
														</div>
													)
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</td>
			</tr>
		</>
	)
}

export default AlertRow
