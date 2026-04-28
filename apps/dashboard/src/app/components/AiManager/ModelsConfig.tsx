import { iAiConfig, iAvailableModel } from '@sentinel-supreme/shared'
import { Cpu, MessageSquare, Thermometer, Zap, ZapOff } from 'lucide-react'
import { ChangeEvent, FC } from 'react'
import { eAiEngine } from '../../types'

interface iProps {
	config: iAiConfig
	availableModels: iAvailableModel[]
	handleAnalysisModelChange: (e: ChangeEvent<HTMLSelectElement>) => void
	handleChatModelChange: (e: ChangeEvent<HTMLSelectElement>) => void
	handleTemperatureChange: (e: ChangeEvent<HTMLInputElement>, engine: eAiEngine) => void
	handleTemperatureMouseUp: (engine: eAiEngine) => void
	handleToggleCache: () => Promise<void>
}

const ModelConfig: FC<iProps> = ({
	config,
	availableModels,
	handleAnalysisModelChange,
	handleChatModelChange,
	handleTemperatureChange,
	handleTemperatureMouseUp,
	handleToggleCache
}) => {
	const handleAnalysisTemperatureChange = (e: ChangeEvent<HTMLInputElement>) => {
		handleTemperatureChange(e, eAiEngine.ANALYSIS)
	}

	const handleChatTemperatureChange = (e: ChangeEvent<HTMLInputElement>) => {
		handleTemperatureChange(e, eAiEngine.CHAT)
	}

	const handleAnalysisTemperatureMouseUp = () => {
		handleTemperatureMouseUp(eAiEngine.ANALYSIS)
	}

	const handleChatTemperatureMouseUp = () => {
		handleTemperatureMouseUp(eAiEngine.CHAT)
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300'>
			<div className='p-6 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm flex flex-col justify-between'>
				<div>
					<div className='flex items-center gap-3 mb-8 text-slate-400'>
						<Cpu size={18} className='text-purple-400' />
						<span className='text-xs font-bold uppercase tracking-wider'>
							{'Log Analysis Engine'}
						</span>
					</div>
					<div className='space-y-2'>
						<label className='text-[11px] uppercase text-slate-500 font-bold ml-1'>
							{'Active Model'}
						</label>
						<select
							value={config.analysisAi.modelName}
							onChange={handleAnalysisModelChange}
							className='w-full bg-slate-900 border text-sm rounded-lg p-2.5 border-r-10 border-transparent text-purple-400 outline-none font-mono cursor-pointer'
						>
							{availableModels.map((m) => (
								<option key={m.name} value={m.name}>
									{m.displayName}
								</option>
							))}
						</select>
					</div>
					<div className='space-y-4 pt-8'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2 text-slate-400'>
								<Thermometer size={16} />
								<span className='text-xs font-bold uppercase'>
									{'Creativity Variance'}
								</span>
							</div>
							<span className='font-mono text-cyan-400 text-xs bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20'>
								{config.analysisAi.temperature.toFixed(1)}
							</span>
						</div>
						<input
							type='range'
							min='0'
							max='2'
							step='0.1'
							value={config.analysisAi.temperature}
							onChange={handleAnalysisTemperatureChange}
							onMouseUp={handleAnalysisTemperatureMouseUp}
							className='w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500'
						/>
						<div className='flex justify-between text-sm text-slate-500 font-mono uppercase'>
							<span>{'Precise'}</span>
							<span>{'Balanced'}</span>
							<span>{'Creative'}</span>
						</div>
					</div>
				</div>
				<p className='text-sm text-slate-500 mt-6 italic leading-relaxed'>
					{
						'* This engine is responsible for background scanning and automatic insight generation from system logs.'
					}
				</p>
			</div>
			<div className='p-6 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm space-y-8'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-3 text-slate-400'>
						<MessageSquare size={18} className='text-cyan-400' />
						<span className='text-xs font-bold uppercase tracking-wider'>
							{'Chat Assistant'}
						</span>
					</div>
					<button
						onClick={handleToggleCache}
						className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-mono text-sm uppercase tracking-tighter ${
							config.chatAi.useSemanticCache
								? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
								: 'bg-slate-900 border-slate-700 text-slate-500'
						}`}
					>
						{config.chatAi.useSemanticCache ? <Zap size={12} /> : <ZapOff size={12} />}
						{`Semantic Cache: ${config.chatAi.useSemanticCache ? 'Enabled' : 'Disabled'}`}
					</button>
				</div>
				<div className='space-y-6'>
					<div className='space-y-2'>
						<label className='text-[11px] uppercase text-slate-500 font-bold ml-1'>
							{'Interactive Model'}
						</label>
						<select
							value={config.chatAi.modelName}
							onChange={handleChatModelChange}
							className='w-full bg-slate-900 border text-sm rounded-lg p-2.5 border-r-10 border-transparent text-cyan-400 outline-none font-mono cursor-pointer'
						>
							{availableModels.map((m) => (
								<option key={m.name} value={m.name}>
									{m.displayName}
								</option>
							))}
						</select>
					</div>
					<div className='space-y-4 pt-2'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2 text-slate-400'>
								<Thermometer size={16} />
								<span className='text-xs font-bold uppercase'>
									{'Creativity Variance'}
								</span>
							</div>
							<span className='font-mono text-cyan-400 text-xs bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20'>
								{config.chatAi.temperature.toFixed(1)}
							</span>
						</div>
						<input
							type='range'
							min='0'
							max='2'
							step='0.1'
							value={config.chatAi.temperature}
							onChange={handleChatTemperatureChange}
							onMouseUp={handleChatTemperatureMouseUp}
							className='w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500'
						/>
						<div className='flex justify-between text-sm text-slate-500 font-mono uppercase'>
							<span>{'Precise'}</span>
							<span>{'Balanced'}</span>
							<span>{'Creative'}</span>
						</div>
					</div>
				</div>
				<p className='text-sm text-slate-500 mt-6 italic leading-relaxed'>
					{config.chatAi.useSemanticCache
						? '* Instant responses for recurring technical questions are enabled to save computation power.'
						: '* Real-time neural processing is forced for every interaction.'}
				</p>
			</div>
		</div>
	)
}

export default ModelConfig
