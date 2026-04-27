import { iSimilarPattern } from '@sentinel-supreme/shared'
import { Fingerprint, X } from 'lucide-react'
import { FC, MouseEvent } from 'react'
import ReactMarkdown from 'react-markdown'

interface iProps {
	similarPatterns: iSimilarPattern[]
	toggleModal: (e: MouseEvent) => void
}

const SimilarPatternsModal: FC<iProps> = ({ similarPatterns, toggleModal }) => {
	const handlePropagation = (e: MouseEvent) => {
		e.stopPropagation()
	}

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200'
			onClick={toggleModal}
		>
			<div
				className='bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200'
				onClick={handlePropagation}
			>
				<div className='p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-orange-500/20 rounded-lg'>
							<Fingerprint size={20} className='text-orange-500' />
						</div>
						<div>
							<h2 className='text-slate-100 tracking-tight'>
								{'Similar Patterns Found'}
							</h2>
							<p className='text-xs text-slate-500'>
								{'Historical logs matching current alert behavior'}
							</p>
						</div>
					</div>
					<button
						onClick={toggleModal}
						className='p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer'
					>
						<X size={20} />
					</button>
				</div>
				<div className='p-6 overflow-y-auto custom-scrollbar space-y-4 bg-slate-950/30'>
					{similarPatterns.map((pattern, idx) => (
						<div
							key={idx}
							className='p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-orange-500/30 transition-all group'
						>
							<div className='flex justify-between items-center mb-3'>
								<div className='px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] font-bold text-orange-500 uppercase'>
									{`Confidence Score: ${(pattern.score * 100).toFixed(0)}%`}
								</div>
							</div>
							<div className='space-y-4'>
								<div className='text-slate-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-none'>
									<ReactMarkdown
										components={{
											h3: (props) => (
												<h3
													className='text-cyan-400 font-bold mt-4 mb-2 uppercase tracking-tight'
													{...props}
												/>
											),
											strong: (props) => (
												<strong
													className='text-white font-semibold'
													{...props}
												/>
											),
											ul: (props) => (
												<ul
													className='list-disc list-inside space-y-1 text-slate-400'
													{...props}
												/>
											)
										}}
									>
										{pattern.summary}
									</ReactMarkdown>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default SimilarPatternsModal
