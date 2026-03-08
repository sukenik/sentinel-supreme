export const LOG_SERVICE = 'LOG_SERVICE'

export const QUEUES = {
	LOG_QUEUE: 'log_queue'
}

export const LOG_PATTERNS = {
	NEW_LOG: 'log_message'
}

export const ENV_VARS = {
	RABBITMQ_URL: 'RABBITMQ_URL',
	POSTGRES_USER: 'POSTGRES_USER',
	POSTGRES_PASSWORD: 'POSTGRES_PASSWORD',
	POSTGRES_DB: 'POSTGRES_DB',
	POSTGRES_PORT: 'POSTGRES_PORT'
}

export const DL_CONFIG = {
	DLX_HEADER: 'x-dead-letter-exchange',
	DL_ROUTING_KEY_HEADER: 'x-dead-letter-routing-key',
	DLX_EXCHANGE: 'log_dlx',
	DLQ_NAME: 'log_queue_dead_letters',
	DL_ROUTING_KEY: 'log_dead_letter_key'
}
