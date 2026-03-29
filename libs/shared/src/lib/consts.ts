export const appConfig = {
	DASHBOARD_URL: 'http://localhost:4200',
	GATEWAY_URL: 'http://localhost:3000/'
}

export const QUEUES = {
	LOGS: 'log_queue',
	UI_UPDATES: 'ui_updates_queue'
}

export const LOG_PATTERNS = {
	NEW_LOG: 'log_message',
	PROCESSED_LOG: 'processed_log',
	NEW_ALERT: 'new_alert'
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
	INITIAL_ADMIN_EMAIL: 'INITIAL_ADMIN_EMAIL',
	INITIAL_ADMIN_PASSWORD: 'INITIAL_ADMIN_PASSWORD',
	REDIS_HOST: 'REDIS_HOST',
	REDIS_PORT: 'REDIS_PORT',
	VIRUSTOTAL_API_KEY: 'VIRUSTOTAL_API_KEY'
}

export const DL_CONFIG = {
	DLX_HEADER: 'x-dead-letter-exchange',
	DL_ROUTING_KEY_HEADER: 'x-dead-letter-routing-key',
	DLX_EXCHANGE: 'log_dlx',
	DLQ_NAME: 'log_queue_dead_letters',
	DL_ROUTING_KEY: 'log_dead_letter_key'
}

export const WS_EVENTS = {
	LOG_RECEIVED: 'log_received',
	ALERT_RECEIVED: 'alert_received'
}

export const WS_ERRORS = {
	NO_TOKEN_PROVIDED: 'No token provided'
}

export const GATEWAY_ROUTES = {
	PREFIX: 'api',
	WS_DASHBOARD_STREAM: 'dashboard-stream',
	AUTH: '/auth',
	LOGS: '/logs',
	USERS: '/users',
	MACHINES: '/machines',
	LOGIN: '/login',
	INGEST: '/ingest',
	REFRESH: '/refresh',
	LOGOUT: '/logout',
	ALERTS: '/alerts'
}
