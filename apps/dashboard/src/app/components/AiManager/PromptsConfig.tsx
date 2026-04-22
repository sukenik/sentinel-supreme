import { iAiConfig } from '@sentinel-supreme/shared'
import { Cpu, MessageSquare, Save } from 'lucide-react'
import { ChangeEvent, FC, MouseEvent, useState } from 'react'
import { eAiEngine } from '../../types'

interface iProps {
	config: iAiConfig
	isSaving: boolean
	handleSaveSystemMessage: (engine: eAiEngine) => void
	handleSystemMessageChange: (e: ChangeEvent<HTMLTextAreaElement>, engine: eAiEngine) => void
}

const PromptsConfig: FC<iProps> = ({
	config,
	isSaving,
	handleSaveSystemMessage,
	handleSystemMessageChange
}) => {
	const [activePrompt, setActivePrompt] = useState<eAiEngine>(eAiEngine.ANALYSIS)

	const handleTabClick = (e: MouseEvent) => {
		const value = e.currentTarget.id as eAiEngine
		if (value === activePrompt) return
		setActivePrompt(value)
	}

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		handleSystemMessageChange(e, activePrompt)
	}

	const handleSave = () => {
		handleSaveSystemMessage(activePrompt)
	}

	return (
		<div className='h-full flex flex-col p-6 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm shadow-xl animate-in fade-in duration-300'>
			<div className='flex items-center justify-between mb-6'>
				<div className='flex p-1 bg-slate-950/50 rounded-lg border border-slate-700'>
					<button
						id={eAiEngine.ANALYSIS}
						onClick={handleTabClick}
						className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all border ${
							activePrompt === eAiEngine.ANALYSIS
								? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
								: 'text-slate-500 border-transparent hover:text-slate-400'
						}`}
					>
						<Cpu size={14} />
						{'ANALYSIS ENGINE'}
					</button>
					<button
						id={eAiEngine.CHAT}
						onClick={handleTabClick}
						className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all border ${
							activePrompt === eAiEngine.CHAT
								? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
								: 'text-slate-500 border-transparent hover:text-slate-400'
						}`}
					>
						<MessageSquare size={14} />
						{'CHAT INTERFACE'}
					</button>
				</div>
				<button
					onClick={handleSave}
					disabled={isSaving}
					className='flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-5 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50 shadow-lg shadow-cyan-900/20 cursor-pointer'
				>
					<Save size={14} />
					{isSaving ? 'SYNCING...' : 'UPDATE PROMPT'}
				</button>
			</div>
			<div className='flex-1 relative group'>
				<div
					className={`absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 transition-colors ${
						activePrompt === eAiEngine.ANALYSIS
							? 'border-purple-500/50'
							: 'border-cyan-500/50'
					}`}
				/>
				<textarea
					value={config[activePrompt].systemPrompt}
					onChange={handleChange}
					className={`h-full w-full bg-slate-950/60 border border-slate-700 rounded-lg p-6 text-sm text-slate-300 font-mono leading-relaxed focus:ring-1 focus:ring-cyan-500/5 outline-none resize-none min-h-87.5 custom-scrollbar ${
						activePrompt === eAiEngine.ANALYSIS
							? 'focus:border-purple-500/40'
							: 'focus:border-cyan-500/40'
					}`}
					placeholder={`Define behavior for ${activePrompt === eAiEngine.ANALYSIS ? 'Log Analysis' : 'Chat Assistant'}...`}
				/>
			</div>
		</div>
	)
}

export default PromptsConfig
