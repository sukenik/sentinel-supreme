export const appConfig = {
	DASHBOARD_URL: 'http://localhost:4200',
	GATEWAY_URL: 'http://localhost:3000/',
	NOTIFICATION_SERVICE_URL: 'http://localhost:3005/'
}

export const QUEUES = {
	LOGS: 'log_queue',
	UI_UPDATES: 'ui_updates_queue',
	NOTIFICATIONS: 'notifications_queue'
}

export const LOG_PATTERNS = {
	NEW_LOG: 'log_message',
	PROCESSED_LOG: 'processed_log',
	NEW_ALERT: 'new_alert'
}

export const NOTIFICATION_PATTERNS = {
	SEND: 'notification.send'
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
	VIRUSTOTAL_API_KEY: 'VIRUSTOTAL_API_KEY',
	LOG_RETENTION_DAYS: 'LOG_RETENTION_DAYS',
	SMTP_HOST: 'SMTP_HOST',
	SMTP_PORT: 'SMTP_PORT',
	SMTP_USER: 'SMTP_USER',
	SMTP_PASS: 'SMTP_PASS',
	SLACK_WEBHOOK_URL: 'SLACK_WEBHOOK_URL'
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

export const WS_EVENTS = {
	LOG_RECEIVED: 'log_received',
	ALERT_RECEIVED: 'alert_received'
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
	SEND_NOTIFICATION: '/send'
}

export const REDIS_CHANNELS = {
	RULES_UPDATED: 'RULES_UPDATED'
}

export const REDIS_SUBSCRIBER = 'subscriber'
