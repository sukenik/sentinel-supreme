import { DEFAULT_AI_CONFIG, GATEWAY_ROUTES, iAiConfig } from '@sentinel-supreme/shared'
import { Cpu, Database, MessageSquare, RotateCcw, Save, Thermometer, Zap } from 'lucide-react'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import { eToastType, iToastMessage } from '../types'
import ConfirmModal from './ConfirmModal'

const AiManager: FC = () => {
	const [config, setConfig] = useState<iAiConfig | null>(null)
	const [availableModels, setAvailableModels] = useState<{ name: string; displayName: string }[]>(
		[]
	)
	const [toastMessage, setToastMessage] = useState<iToastMessage | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		const fetchAiConfig = async () => {
			try {
				const configRes = await api.get(GATEWAY_ROUTES.AI_CONFIG)
				setConfig(configRes.data.data || configRes.data)
				const modelsRes = await api.get(
					`${GATEWAY_ROUTES.AI_CONFIG}${GATEWAY_ROUTES.AI_MODELS}`
				)
				setAvailableModels(modelsRes.data.data)
			} catch (err) {
				console.error('Failed to fetch AI config', err)
			} finally {
				setIsLoading(false)
			}
		}
		fetchAiConfig()
	}, [])

	useEffect(() => {
		if (toastMessage) {
			const timer = setTimeout(() => {
				setToastMessage(null)
			}, 3000)
			return () => clearTimeout(timer)
		}

		return
	}, [toastMessage])

	const updateField = async (fields: Partial<iAiConfig>, field?: keyof iAiConfig) => {
		if (!config) return
		setIsSaving(true)
		try {
			await api.patch(`${GATEWAY_ROUTES.AI_CONFIG}/${config.id}`, fields)
			setToastMessage({
				message: field ? `Updated ${field} successfully` : 'Reset successfully',
				type: eToastType.SUCCESS
			})
		} catch (err) {
			console.error('Save failed', err)
			setToastMessage({
				message: 'Save failed',
				type: eToastType.ERROR
			})
		} finally {
			setIsSaving(false)
		}
	}

	const handleSaveSystemMessage = () => {
		updateField({ systemMessage: config!.systemMessage }, 'systemMessage')
	}

	const handleModelChange = async (e: ChangeEvent<HTMLSelectElement>) => {
		const modelName = e.target.value
		setConfig({ ...config!, modelName })
		updateField({ modelName }, 'modelName')
	}

	const handleSystemMessageChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
		setConfig({ ...config!, systemMessage: e.target.value })
	}

	const handleTemperatureChange = (e: ChangeEvent<HTMLInputElement>) => {
		setConfig({ ...config!, temperature: parseFloat(e.target.value) })
	}

	const handleTemperatureMouseUp = () => {
		updateField({ temperature: config!.temperature }, 'temperature')
	}

	const handleResetClick = () => {
		toggleDeleteModal()
	}

	const confirmReset = async () => {
		const newConfig = {
			...config!,
			modelName: DEFAULT_AI_CONFIG.modelName!,
			temperature: DEFAULT_AI_CONFIG.temperature!,
			systemMessage: DEFAULT_AI_CONFIG.systemMessage!
		}
		setConfig(newConfig)
		updateField(newConfig)
		toggleDeleteModal()
	}

	const toggleDeleteModal = () => {
		setIsModalOpen((prevState) => !prevState)
	}

	if (isLoading || !config)
		return (
			<div className='p-10 text-center text-slate-500 animate-pulse font-mono tracking-widest'>
				{'INITIALIZING NEURAL ENGINE...'}
			</div>
		)

	return (
		<div className='h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-top-4 duration-300'>
			<div className='flex justify-between items-center shrink-0'>
				<h3 className='text-xl font-bold text-cyan-400 flex items-center gap-2'>
					<Zap size={20} className='fill-cyan-400' />
					{'AI Configuration & Insight Engine'}
				</h3>
				<button
					onClick={handleResetClick}
					className='flex items-center gap-2 text-slate-500 hover:text-red-400 text-md font-mono transition-colors cursor-pointer bg-blue-800/10 px-2 py-0.5 rounded border border-blue-500/20'
				>
					<RotateCcw size={14} />
					{'RESET TO DEFAULT'}
				</button>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-1 space-y-4'>
					<div className='p-5 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm shadow-xl shadow-cyan-900/10'>
						<div className='flex items-center gap-3 mb-3 text-slate-400'>
							<Database size={18} />
							<span className='text-xs font-bold uppercase tracking-wider'>
								{'Token Usage'}
							</span>
						</div>
						<div className='text-3xl font-mono text-white'>
							{Number(config.totalTokensUsed).toLocaleString()}
						</div>
						<p className='text-sm text-slate-500 mt-2 font-medium'>
							{'Accumulated tokens processed by the engine.'}
						</p>
					</div>
					<div className='p-5 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm'>
						<div className='flex items-center gap-3 mb-3 text-slate-400'>
							<Cpu size={18} />
							<span className='text-xs font-bold uppercase tracking-wider'>
								{'Active Neural Model'}
							</span>
						</div>
						<select
							value={config.modelName}
							onChange={handleModelChange}
							className='w-full bg-slate-900 border border-slate-700 text-cyan-400 text-sm rounded-lg p-2.5 outline-none font-mono cursor-pointer'
						>
							{availableModels.length > 0 ? (
								availableModels.map((m) => (
									<option key={m.name} value={m.name} className='cursor-pointer'>
										{m.displayName}
									</option>
								))
							) : (
								<option value={config.modelName}>{config.modelName}</option>
							)}
						</select>
					</div>
					<div className='p-5 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm'>
						<div className='flex items-center justify-between mb-3 text-slate-400'>
							<div className='flex items-center gap-3'>
								<Thermometer size={18} />
								<span className='text-xs font-bold uppercase tracking-wider'>
									{'Model Temperature'}
								</span>
							</div>
							<span className='font-mono text-cyan-400 text-xs bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20'>
								{config.temperature.toFixed(1)}
							</span>
						</div>
						<input
							type='range'
							min='0'
							max='2'
							step='0.1'
							value={config.temperature}
							onChange={handleTemperatureChange}
							onMouseUp={handleTemperatureMouseUp}
							className='w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-5'
						/>
						<div className='flex justify-between mt-2 mb-5 text-xs text-slate-500 font-mono italic'>
							<span>{'Precise (0.0)'}</span>
							<span>{'Creative (2.0)'}</span>
						</div>
						<p className='text-sm text-slate-500 mt-2 font-medium'>
							{'Controls the randomness of the output.'}
						</p>
					</div>
				</div>
				<div className='lg:col-span-2 p-6 bg-slate-800/40 border border-slate-700 rounded-xl backdrop-blur-sm flex flex-col shadow-xl shadow-slate-900/50'>
					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center gap-3 text-slate-400'>
							<MessageSquare size={18} />
							<span className='text-xs font-bold uppercase tracking-wider'>
								{'System Analysis Prompt'}
							</span>
						</div>
						<button
							onClick={handleSaveSystemMessage}
							disabled={isSaving}
							className={`flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-5 py-2.5 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-cyan-900/20 cursor-${isSaving ? 'progress' : 'pointer'}`}
						>
							<Save size={14} /> {isSaving ? 'RECALIBRATING...' : 'UPDATE ENGINE'}
						</button>
					</div>
					<textarea
						value={config.systemMessage}
						onChange={handleSystemMessageChange}
						className='flex-1 w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 font-mono leading-relaxed focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none resize-none custom-scrollbar min-h-87.5 transition-all'
						placeholder='Define AI persona and constraints...'
					/>
					<div className='mt-3 flex justify-between items-center'>
						<div className='text-sm text-slate-500 italic'>
							{'* Real-time update: Changes take effect on the next log analysis.'}
						</div>
						<div className='text-sm text-slate-400 font-mono'>
							{`CHARS: ${config.systemMessage.length}`}
						</div>
					</div>
				</div>
			</div>
			{isModalOpen && (
				<ConfirmModal
					onClose={toggleDeleteModal}
					onConfirm={confirmReset}
					title={'Confirm Reset To Default'}
					message={'Are you sure you want to reset? This action cannot be undone.'}
				/>
			)}
			{toastMessage && (
				<div
					className={`fixed bottom-5 right-5 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300 ${
						toastMessage.type === eToastType.SUCCESS ? 'bg-green-600' : 'bg-red-600'
					}`}
				>
					{toastMessage.message}
				</div>
			)}
		</div>
	)
}

export default AiManager
