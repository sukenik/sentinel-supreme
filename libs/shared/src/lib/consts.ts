export const LOG_SERVICE = 'LOG_SERVICE'
export const GATEWAY_SERVICE = 'GATEWAY_SERVICE'

export const QUEUES = {
	LOG_QUEUE: 'log_queue',
	UI_UPDATE_QUEUE: 'ui_updates_queue'
}

export const LOG_PATTERNS = {
	NEW_LOG: 'log_message',
	BROADCAST_TO_UI: 'broadcast_to_ui'
}

export const ENV_VARS = {
	PG_USER: 'PG_USER',
	PG_PASSWORD: 'PG_PASSWORD',
	PG_DB: 'PG_DB',
	PG_PORT: 'PG_PORT',
	JWT_SECRET: 'JWT_SECRET',
	JWT_EXPIRATION_IN_SECONDS: 'JWT_EXPIRATION_IN_SECONDS',
	MONGO_USER: 'MONGO_USER',
	MONGO_PASSWORD: 'MONGO_PASSWORD',
	MONGO_PORT: 'MONGO_PORT',
	MONGO_DB: 'MONGO_DB',
	RMQ_USER: 'RMQ_USER',
	RMQ_PASSWORD: 'RMQ_PASSWORD',
	RMQ_PORT: 'RMQ_PORT',
	RMQ_VHOST: 'RMQ_VHOST',
	GATEWAY_PORT: 'GATEWAY_PORT'
}

export const DL_CONFIG = {
	DLX_HEADER: 'x-dead-letter-exchange',
	DL_ROUTING_KEY_HEADER: 'x-dead-letter-routing-key',
	DLX_EXCHANGE: 'log_dlx',
	DLQ_NAME: 'log_queue_dead_letters',
	DL_ROUTING_KEY: 'log_dead_letter_key'
}

export const JWT_FALLBACK_SECRET = 'fallback_secret'
