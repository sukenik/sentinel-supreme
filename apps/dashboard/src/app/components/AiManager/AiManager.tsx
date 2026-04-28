import {
	DEFAULT_AI_CONFIG,
	eAvailableModles,
	GATEWAY_ROUTES,
	iAiConfig,
	iAvailableModel,
	iChatAiConfig
} from '@sentinel-supreme/shared'
import { Activity, RotateCcw, Settings2, Terminal, Zap } from 'lucide-react'
import { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react'
import api from '../../api/axiosInstance'
import { eAiSettingsTabs } from '../../consts'
import { eAiEngine, eToastType, iToastMessage } from '../../types'
import ConfirmModal from '../ConfirmModal'
import ModelConfig from './ModelsConfig'
import PromptsConfig from './PromptsConfig'
import UsageStats from './UsageStats'

const AiManager: FC = () => {
	const [config, setConfig] = useState<iAiConfig | null>(null)
	const [availableModels, setAvailableModels] = useState<iAvailableModel[]>([])
	const [toastMessage, setToastMessage] = useState<iToastMessage | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [activeTab, setActiveTab] = useState<eAiSettingsTabs>(eAiSettingsTabs.MODELS)

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

	const updateField = async (fields: Partial<iAiConfig>, field?: string) => {
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

	const handleSaveSystemMessage = (engine: eAiEngine) => {
		if (!config) return

		const label = engine === eAiEngine.ANALYSIS ? 'Analysis Prompt' : 'Chat Prompt'
		updateField({ [engine]: { ...config[engine] } }, label)
	}

	const handleAnalysisModelChange = async (e: ChangeEvent<HTMLSelectElement>) => {
		if (!config) return

		const modelName = e.target.value as eAvailableModles
		setConfig({ ...config, analysisAi: { ...config.analysisAi, modelName } })
		updateField({ analysisAi: { ...config.analysisAi, modelName } }, 'log analysis model')
	}

	const handleChatModelChange = async (e: ChangeEvent<HTMLSelectElement>) => {
		if (!config) return

		const modelName = e.target.value as eAvailableModles
		setConfig({ ...config, chatAi: { ...config.chatAi, modelName } })
		updateField({ chatAi: { ...config.chatAi, modelName } }, 'chat model')
	}

	const handleSystemMessageChange = async (
		e: ChangeEvent<HTMLTextAreaElement>,
		engine: eAiEngine
	) => {
		if (!config) return

		setConfig({
			...config,
			[engine]: {
				...config[engine],
				systemPrompt: e.target.value
			}
		})
	}

	const handleTemperatureChange = (e: ChangeEvent<HTMLInputElement>, engine: eAiEngine) => {
		if (!config) return

		setConfig({
			...config,
			[engine]: {
				...config[engine],
				temperature: parseFloat(e.target.value)
			}
		})
	}

	const handleTemperatureMouseUp = (engine: eAiEngine) => {
		if (!config) return

		updateField(
			{ [engine]: { ...config[engine] } },
			`${engine === eAiEngine.ANALYSIS ? 'Analysis' : 'Chat'} Temperature`
		)
	}

	const handleResetClick = () => {
		toggleDeleteModal()
	}

	const confirmReset = async () => {
		const newConfig = {
			...config!,
			analysisAi: DEFAULT_AI_CONFIG.analysisAi!,
			chatAi: DEFAULT_AI_CONFIG.chatAi!
		}
		setConfig(newConfig)
		updateField(newConfig)
		toggleDeleteModal()
	}

	const toggleDeleteModal = () => {
		setIsModalOpen((prevState) => !prevState)
	}

	const handleTabChange = (e: MouseEvent) => {
		const tab = e.currentTarget.id as eAiSettingsTabs
		setActiveTab(tab)
	}

	const handleToggleCache = async () => {
		if (!config) return

		const updatedChatAi = {
			...config.chatAi,
			useSemanticCache: !config.chatAi.useSemanticCache
		} as iChatAiConfig

		setConfig({ ...config, chatAi: updatedChatAi })
		updateField({ chatAi: updatedChatAi }, 'Semantic Cache')
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
			<div className='flex gap-2 p-1 bg-slate-950/40 border border-slate-800/50 rounded-xl w-fit shadow-inner'>
				{Object.values(eAiSettingsTabs).map((tab) => (
					<button
						key={tab}
						id={tab}
						onClick={handleTabChange}
						className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
							activeTab === tab
								? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
								: 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
						}`}
					>
						{tab === eAiSettingsTabs.MODELS && <Settings2 size={14} />}
						{tab === eAiSettingsTabs.PROMPTS && <Terminal size={14} />}
						{tab === eAiSettingsTabs.USAGE && <Activity size={14} />}
						{tab.replace('_', ' ')}
					</button>
				))}
			</div>
			<div className='flex-1 min-h-112.5 relative'>
				<div className='inset-0'>
					{activeTab === eAiSettingsTabs.MODELS && (
						<ModelConfig
							config={config}
							availableModels={availableModels}
							handleAnalysisModelChange={handleAnalysisModelChange}
							handleChatModelChange={handleChatModelChange}
							handleTemperatureChange={handleTemperatureChange}
							handleTemperatureMouseUp={handleTemperatureMouseUp}
							handleToggleCache={handleToggleCache}
						/>
					)}
					{activeTab === eAiSettingsTabs.PROMPTS && (
						<PromptsConfig
							config={config}
							isSaving={isSaving}
							handleSaveSystemMessage={handleSaveSystemMessage}
							handleSystemMessageChange={handleSystemMessageChange}
						/>
					)}
					{activeTab === eAiSettingsTabs.USAGE && (
						<UsageStats totalTokensUsed={config.totalTokensUsed} />
					)}
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
