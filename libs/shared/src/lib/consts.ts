import { eAvailableModles, iAiConfig } from './ai.types'

export const appConfig = {
	DASHBOARD_URL: 'http://localhost:4200',
	GATEWAY_URL: 'http://localhost:3000/',
	NOTIFICATION_SERVICE_URL: 'http://localhost:3005/',
	PROMETHEUS_ENDPOINT: '/metrics'
}

export const QUEUES = {
	LOGS: 'log_queue',
	UI_UPDATES: 'ui_updates_queue',
	NOTIFICATIONS: 'notifications_queue',
	AI_ANALYSIS: 'ai_analysis_queue',
	AI_ANALYSIS_RESULTS: 'ai_analysis_results_queue',
	AI_CHAT_REQUEST: 'ai_chat_request_queue',
	AI_CHAT_RESPONSE: 'ai_chat_response_queue'
}

export const LOG_PATTERNS = {
	NEW_LOG: 'log_message',
	PROCESSED_LOG: 'processed_log',
	NEW_ALERT: 'new_alert',
	ALERT_UPDATED: 'alert_updated'
}

export const NOTIFICATION_PATTERNS = {
	SEND: 'notification.send'
}

export const AI_ANALYSIS_PATTERNS = {
	ANALYZE_LOGS: 'analyze_logs',
	ANALYSIS_COMPLETED: 'analysis_completed'
}

export const AI_CHAT_PATTERNS = {
	REQUEST: 'chat_request',
	CHUNK: 'chat_chunk',
	ERROR: 'chat_error'
}

export const ENV_VARS = {
	PG_USER: 'PG_USER',
	PG_PASSWORD: 'PG_PASSWORD',
	PG_DB: 'PG_DB',
	PG_PORT: 'PG_PORT',
	PG_HOST: 'PG_HOST',
	JWT_SECRET: 'JWT_SECRET',
	JWT_EXPIRATION_IN_SECONDS: 'JWT_EXPIRATION_IN_SECONDS',
	MONGO_USER: 'MONGO_USER',
	MONGO_PASSWORD: 'MONGO_PASSWORD',
	MONGO_PORT: 'MONGO_PORT',
	MONGO_DB: 'MONGO_DB',
	MONGO_HOST: 'MONGO_HOST',
	RMQ_USER: 'RMQ_USER',
	RMQ_PASSWORD: 'RMQ_PASSWORD',
	RMQ_PORT: 'RMQ_PORT',
	RMQ_VHOST: 'RMQ_VHOST',
	RMQ_HOST: 'RMQ_HOST',
	GATEWAY_PORT: 'GATEWAY_PORT',
	LOG_PROCESSOR_PORT: 'LOG_PROCESSOR_PORT',
	AI_SERVICE_PORT: 'AI_SERVICE_PORT',
	NOTIFICATION_SERVICE_PORT: 'NOTIFICATION_SERVICE_PORT',
	INITIAL_ADMIN_EMAIL: 'INITIAL_ADMIN_EMAIL',
	INITIAL_ADMIN_PASSWORD: 'INITIAL_ADMIN_PASSWORD',
	REDIS_HOST: 'REDIS_HOST',
	REDIS_PORT: 'REDIS_PORT',
	VIRUSTOTAL_API_KEY: 'VIRUSTOTAL_API_KEY',
	LOG_RETENTION_DAYS: 'LOG_RETENTION_DAYS',
	SMTP_HOST: 'SMTP_HOST',
	SMTP_PORT: 'SMTP_PORT',
	SMTP_USER: 'SMTP_USER',
	SMTP_PASS: 'SMTP_PASS',
	SLACK_WEBHOOK_URL: 'SLACK_WEBHOOK_URL',
	DISCORD_WEBHOOK_URL: 'DISCORD_WEBHOOK_URL',
	GEMINI_API_KEY: 'GEMINI_API_KEY',
	QDRANT_HOST: 'QDRANT_HOST',
	QDRANT_PORT: 'QDRANT_PORT'
}

export const DL_CONFIG = {
	DLX_HEADER: 'x-dead-letter-exchange',
	DL_ROUTING_KEY_HEADER: 'x-dead-letter-routing-key'
}

export const LOG_DLX = {
	DLX_NAME: 'log_dlx',
	DLQ_NAME: 'log_queue_dead_letters',
	DL_ROUTING_KEY: 'log_dead_letter_key'
}

export const NOTIFICATIONS_DLX = {
	DLX_NAME: 'notifications_dlx',
	DLQ_NAME: 'notifications_queue_dead_letters',
	DL_ROUTING_KEY: 'notifications_dead_letter_key'
}

export const AI_ANALYSIS_DLX = {
	DLX_NAME: 'ai_analysis_dlx',
	DLQ_NAME: 'ai_analysis_queue_dead_letters',
	DL_ROUTING_KEY: 'ai_analysis_dead_letter_key'
}

export const AI_ANALYSIS_RESULTS_DLX = {
	DLX_NAME: 'ai_analysis_results_dlx',
	DLQ_NAME: 'ai_analysis_result_queue_dead_letters',
	DL_ROUTING_KEY: 'ai_analysis_results_dead_letter_key'
}

export const WS_EVENTS = {
	LOG_RECEIVED: 'log_received',
	ALERT_RECEIVED: 'alert_received',
	AI_ANALYSIS_RECEIVED: 'ai_analysis_received',
	AI_CHAT_CHUNK_RECEIVED: 'ai_chat_chunk_received',
	AI_CHAT_ERROR_RECEIVED: 'ai_chat_error_received'
}

export const WS_ERRORS = {
	NO_TOKEN_PROVIDED: 'No token provided'
}

export const SERVER_GLOBAL_PREFIX = 'api'

export const GATEWAY_ROUTES = {
	WS_DASHBOARD_STREAM: 'dashboard-stream',
	AUTH: '/auth',
	LOGS: '/logs',
	USERS: '/users',
	MACHINES: '/machines',
	LOGIN: '/login',
	INGEST: '/ingest',
	REFRESH: '/refresh',
	LOGOUT: '/logout',
	ALERTS: '/alerts',
	RULES: '/rules',
	LOG_SEARCH: '/log-search',
	SEARCH: '/search',
	NOTIFICATIONS: '/notifications',
	GLOBAL_MUTE: '/global-mute',
	LOG_COUNT: '/log-count',
	AI_CONFIG: '/ai-config',
	AI_MODELS: '/ai-models',
	AI_CHAT: '/ai-chat'
}

export const REDIS_CHANNELS = {
	RULES_UPDATED: 'RULES_UPDATED',
	NOTIFICATIONS_PREFERENCES_UPDATED: 'NOTIFICATIONS_PREFERENCES_UPDATED',
	GLOBAL_MUTE_UPDATED: 'GLOBAL_MUTE_UPDATED'
}

export const REDIS_SUBSCRIBER = 'subscriber'

export const DEFAULT_AI_CONFIG: Partial<iAiConfig> = {
	totalTokensUsed: 0,
	analysisAi: {
		modelName: eAvailableModles.GEMINI_3_1_FLASH_LITE_PREVIEW,
		temperature: 0.1,
		systemPrompt: `
			You are a Senior SOC (Security Operations Center) Analyst at Sentinel Supreme.
			Your task is to analyze security logs and provide actionable insights.

			### OUTPUT GUIDELINES:
			1. **Format**: Use strict Markdown formatting.
			2. **Tone**: Professional, concise, and technical yet accessible.
			3. **Sections**: You must include the following three sections:

			---
			### 📝 SUMMARY
			[1-2 sentences explaining the detected pattern or event. Use **bold** for key entities like IPs, Usernames, or File Paths.]

			### ⚠️ RISK LEVEL
			[Specify: **Low**, **Medium**, **High**, or **Critical**]
			[Briefly explain *why* this risk level was chosen.]

			### 💡 RECOMMENDATION
			- [Immediate Action 1]
			- [Immediate Action 2 (if applicable)]
			
			---
			### VISUAL CUES:
			- Use 🛡️ for system protection notes.
			- Use 🚩 for red flags.
			- Use ⚡ for immediate actions.

			**Important**: Output ONLY the Markdown content. Do not include introductory or concluding remarks.
		`
	},
	chatAi: {
		modelName: eAvailableModles.GEMINI_3_1_FLASH_LITE_PREVIEW,
		temperature: 0.1,
		useSemanticCache: false,
		systemPrompt: `
			You are Sentinel Supreme Assistant.
			Use the provided tools to answer questions about system health.
			If there are many errors, be concise and alert the user.
		`
	}
}
