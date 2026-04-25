import { AlertCircle, Bot, Cpu, Database, Loader2, Send, Sparkles, User } from 'lucide-react'
import { ChangeEvent, FC, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { useAiStream } from '../hooks/useAiStream'
import { eChatRole } from '../types'
import { SUGGESTED_PROMPTS } from '../utils'

const AiChatPage: FC = () => {
	const { messages, sendMessage, isTyping, activeModel } = useAiStream()
	const [input, setInput] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(scrollToBottom, [messages])

	const handleSend = () => {
		if (!input.trim() || isTyping) return
		sendMessage(input)
		setInput('')
	}

	const handleEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleSend()
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value)
	}

	const handlePromptClick = (e: MouseEvent) => {
		sendMessage(e.currentTarget.id)
	}

	return (
		<div className='flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md'>
			<div className='p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<div className='p-2 bg-cyan-500/10 rounded-lg text-cyan-400'>
						<Bot size={20} />
					</div>
					<div className='flex items-center'>
						<h2 className='text-sm font-bold uppercase tracking-widest text-cyan-500'>
							{'Sentinel Supreme AI'}
						</h2>
						<div className='mx-4 w-px h-4 bg-slate-700' />
						<div className='flex justify-center items-center gap-2 px-2.5 py-1 bg-slate-950/50 border border-slate-800 rounded-full shadow-inner'>
							<Cpu size={14} className='text-slate-500' />
							<span className='text-sm font-mono font-medium text-slate-400 uppercase tracking-tight'>
								<span className='text-slate-600 mr-1'>{'MODEL:'}</span>
								<span
									className={activeModel ? 'text-cyan-400/80' : 'text-slate-600'}
								>
									{activeModel || 'SYNCHRONIZING...'}
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='flex-1 overflow-y-auto min-h-0 p-6 custom-scrollbar bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950'>
				<div className='flex flex-col gap-6 min-h-full'>
					{messages.length === 0 && (
						<div className='flex-1 flex flex-col items-center justify-center space-y-6'>
							<div className='text-center space-y-2'>
								<Bot size={48} className='opacity-20 mx-auto text-cyan-500' />
								<p className='font-mono text-sm text-slate-500 italic'>
									{'Systems clear. How can I assist with your logs today?'}
								</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg'>
								{SUGGESTED_PROMPTS.map((prompt) => (
									<button
										key={prompt}
										id={prompt}
										onClick={handlePromptClick}
										className='cursor-pointer text-left p-3 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:border-cyan-500/50 hover:bg-slate-800 transition-all group'
									>
										<Sparkles
											size={12}
											className='inline mr-2 text-cyan-600 group-hover:text-cyan-400'
										/>
										{prompt}
									</button>
								))}
							</div>
						</div>
					)}
					{messages.map((msg) => (
						<div
							key={msg.id}
							className={`flex ${msg.role === eChatRole.USER ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`flex gap-3 max-w-[80%] ${msg.role === eChatRole.USER ? 'flex-row-reverse' : 'flex-row'}`}
							>
								<div
									className={`mt-1 shrink-0 w-8 h-8 rounded border flex items-center justify-center ${msg.role === eChatRole.USER ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'}`}
								>
									{msg.role === eChatRole.USER ? (
										<User size={16} />
									) : (
										<Bot size={16} />
									)}
								</div>
								<div
									className={`p-4 rounded-2xl text-sm relative group ${
										msg.role === eChatRole.USER
											? 'bg-slate-800 text-slate-200 rounded-tr-none'
											: msg.isError
												? 'bg-red-900/20 border border-red-500/50 text-red-400 rounded-tl-none font-mono'
												: 'bg-blue-900/20 border border-blue-500/20 text-cyan-50 rounded-tl-none'
									}`}
								>
									{msg.isError && (
										<div className='flex items-center gap-2 mb-2 text-red-500 font-bold border-b border-red-500/20 pb-1'>
											<AlertCircle size={14} />
											<span className='text-[10px] uppercase tracking-tighter'>
												{'System Protocol Error'}
											</span>
										</div>
									)}
									{msg.hasUsedTools && !msg.isError && (
										<div className='flex items-center gap-2 mb-2 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-400 font-mono w-fit'>
											<Database size={10} />
											<span>{'QUERIED SYSTEM METRICS'}</span>
										</div>
									)}
									<div className={msg.isError ? 'opacity-90' : ''}>
										{msg.content}
									</div>
									{msg.role === eChatRole.AI &&
										msg.tokensUsed &&
										!msg.isStreaming && (
											<div className='mt-2 pt-2 border-t border-cyan-500/10 text-xs font-mono text-slate-500 flex justify-between items-center'>
												<span>{'COMPUTATION FINISHED'}</span>
												<span className='text-cyan-600'>
													{msg.tokensUsed}
													{' TOKENS '}
												</span>
											</div>
										)}
									{msg.isStreaming && (
										<span className='inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse align-middle' />
									)}
								</div>
							</div>
						</div>
					))}
					{isTyping && messages[messages.length - 1]?.content === '' && (
						<div className='flex justify-start animate-in fade-in slide-in-from-bottom-2'>
							<div className='flex gap-3 items-center text-slate-500 font-mono text-xs ml-11'>
								<Loader2 size={14} className='animate-spin text-cyan-500' />
								{'THINKING...'}
							</div>
						</div>
					)}
					<div ref={messagesEndRef} className='h-0' />
				</div>
			</div>
			<div className='p-4 bg-slate-900/80 border-t border-slate-800'>
				<div className='relative flex items-center'>
					<input
						type='text'
						value={input}
						onChange={handleInputChange}
						onKeyDown={handleEnterPressed}
						placeholder='Ask Sentinel AI about system logs, health or patterns...'
						className='w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-12 py-3 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700'
					/>
					<button
						onClick={handleSend}
						disabled={isTyping || !input.trim()}
						className='absolute right-2 p-2 text-cyan-500 hover:text-cyan-400 disabled:text-slate-800 transition-colors cursor-pointer'
					>
						<Send size={18} />
					</button>
				</div>
			</div>
		</div>
	)
}

export default AiChatPage
