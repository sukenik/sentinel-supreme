import { GATEWAY_ROUTES, iAiChatChunk, iAiConfig, WS_EVENTS } from '@sentinel-supreme/shared'
import { useCallback, useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import { socket } from '../api/socket'
import { eChatRole } from '../types'

interface iMessage {
	id: string
	role: eChatRole
	content: string
	isStreaming?: boolean
	hasUsedTools?: boolean
	tokensUsed?: number
	isError?: boolean
}

export const useAiStream = () => {
	const [messages, setMessages] = useState<iMessage[]>([])
	const [isTyping, setIsTyping] = useState(false)
	const [activeModel, setActiveModel] = useState<string>('')

	useEffect(() => {
		api.get(GATEWAY_ROUTES.AI_CONFIG).then((res) => {
			const config = res.data.data as iAiConfig
			setActiveModel(config.chatAi.modelName)
		})

		const handleChunk = (data: Partial<iAiChatChunk>) => {
			if (data.isFinal) setIsTyping(false)

			setMessages((prev) => {
				const lastMessage = prev[prev.length - 1]
				if (lastMessage?.role === eChatRole.AI && lastMessage.isStreaming) {
					const rawContent = data.content || ''

					return [
						...prev.slice(0, -1),
						{
							...lastMessage,
							content: data.hasUsedTools
								? lastMessage.content
								: lastMessage.content + rawContent,
							hasUsedTools: lastMessage.hasUsedTools || !!data.hasUsedTools,
							tokensUsed: data.tokensUsed || lastMessage.tokensUsed,
							isStreaming: !data.isFinal
						}
					]
				}
				return prev
			})
		}

		const handleError = (data: { error: string }) => {
			setIsTyping(false)

			setMessages((prev) => {
				const lastMessage = prev[prev.length - 1]
				if (lastMessage?.role === eChatRole.AI) {
					return [
						...prev.slice(0, -1),
						{
							...lastMessage,
							content: data.error,
							isStreaming: false,
							isError: true
						}
					]
				}
				return prev
			})
		}

		socket.on(WS_EVENTS.AI_CHAT_CHUNK_RECEIVED, handleChunk)
		socket.on(WS_EVENTS.AI_CHAT_ERROR_RECEIVED, handleError)

		return () => {
			socket.off(WS_EVENTS.AI_CHAT_CHUNK_RECEIVED, handleChunk)
		}
	}, [])

	const sendMessage = useCallback(async (text: string) => {
		if (!text.trim()) return

		const userMsg: iMessage = {
			id: `${eChatRole.USER}-${Date.now()}`,
			role: eChatRole.USER,
			content: text
		}

		const aiPlaceholder: iMessage = {
			id: `${eChatRole.AI}-${Date.now()}`,
			role: eChatRole.AI,
			content: '',
			isStreaming: true,
			hasUsedTools: false
		}

		setMessages((prev) => [...prev, userMsg, aiPlaceholder])
		setIsTyping(true)

		try {
			await api.post(GATEWAY_ROUTES.AI_CHAT, { message: text })
		} catch (error) {
			setIsTyping(false)
			setMessages((prev) => prev.filter((m) => m.id !== aiPlaceholder.id))
		}
	}, [])

	return { messages, sendMessage, isTyping, activeModel }
}
