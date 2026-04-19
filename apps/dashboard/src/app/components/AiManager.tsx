import { Cpu, Database, MessageSquare, Save, Zap } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import api from '../api/axiosInstance'

const AiManager: FC = () => {
	const [config, setConfig] = useState({
		model: 'gemini-2.5-flash',
		systemMessage: '',
		totalTokens: 0,
		monthlyCostEstimate: 0
	})
	const [isSaving, setIsSaving] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchAiConfig = async () => {
			try {
				// נניח שיש לך אנדפוינט כזה שמחזיר הגדרות וסטטיסטיקה
				const { data } = await api.get('/ai/config')
				setConfig(data.data)
			} catch (err) {
				console.error('Failed to fetch AI config')
			} finally {
				setIsLoading(false)
			}
		}
		fetchAiConfig()
	}, [])

	const handleSave = async () => {
		setIsSaving(true)
		try {
			await api.patch('/ai/config', {
				systemMessage: config.systemMessage,
				model: config.model
			})
			// אפשר להוסיף כאן טוסט הצלחה
		} finally {
			setIsSaving(false)
		}
	}

	if (isLoading)
		return (
			<div className='p-10 text-center text-slate-500 animate-pulse'>
				Initializing Neural Engine...
			</div>
		)

	return (
		<div className='h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-top-4 duration-300'>
			<div className='flex justify-between items-center shrink-0'>
				<h3 className='text-xl font-bold text-cyan-400 flex items-center gap-2'>
					<Zap size={20} /> AI Configuration & Insight Engine
				</h3>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Statistics Cards */}
				<div className='lg:col-span-1 space-y-4'>
					<div className='p-5 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm'>
						<div className='flex items-center gap-3 mb-3 text-slate-400'>
							<Database size={18} />
							<span className='text-xs font-bold uppercase tracking-wider'>
								Token Usage
							</span>
						</div>
						<div className='text-3xl font-mono text-white'>
							{config.totalTokens.toLocaleString()}
						</div>
						<p className='text-[10px] text-slate-500 mt-2'>
							Accumulated tokens processed this month
						</p>
					</div>

					<div className='p-5 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm'>
						<div className='flex items-center gap-3 mb-3 text-slate-400'>
							<Cpu size={18} />
							<span className='text-xs font-bold uppercase tracking-wider'>
								Active Model
							</span>
						</div>
						<select
							value={config.model}
							onChange={(e) => setConfig({ ...config, model: e.target.value })}
							className='w-full bg-slate-900 border border-slate-700 text-cyan-400 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all cursor-pointer'
						>
							<option value='gemini-2.5-flash'>Gemini 2.5 Flash (Fast)</option>
							<option value='gemini-1.5-pro'>Gemini 1.5 Pro (Precise)</option>
							<option value='gpt-4o'>GPT-4o (Standard)</option>
						</select>
					</div>
				</div>

				{/* System Message Editor */}
				<div className='lg:col-span-2 p-6 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm flex flex-col'>
					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center gap-3 text-slate-400'>
							<MessageSquare size={18} />
							<span className='text-xs font-bold uppercase tracking-wider'>
								System Analysis Prompt
							</span>
						</div>
						<button
							onClick={handleSave}
							disabled={isSaving}
							className='flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition-all cursor-pointer disabled:opacity-50'
						>
							<Save size={14} /> {isSaving ? 'Saving...' : 'Update Engine'}
						</button>
					</div>

					<textarea
						value={config.systemMessage}
						onChange={(e) => setConfig({ ...config, systemMessage: e.target.value })}
						className='flex-1 w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 font-mono leading-relaxed focus:border-cyan-500/50 outline-none resize-none custom-scrollbar min-h-[300px]'
						placeholder='Enter the AI behavior instructions here...'
					/>
					<div className='mt-3 text-[10px] text-slate-500 italic'>
						* This message defines the personality and analytical constraints of the SOC
						Assistant.
					</div>
				</div>
			</div>
		</div>
	)
}

export default AiManager
