import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import {
	MongoModule,
	PostgresModule,
	RedisModule,
	SharedNotificationsPreferencesModule,
	SharedRulesModule
} from '@sentinel-supreme/shared/server'
import Joi from 'joi'
import { AlertsModule } from './alerts/alerts.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { EventsModule } from './events/events.module'
import { IngestionModule } from './ingestion/ingestion.module'
import { LogSearchModule } from './log-search/log-search.module'
import { MachinesModule } from './machines/machines.module'
import { StreamingModule } from './streaming/streaming.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{
				name: 'short',
				ttl: 1000,
				limit: 10
			},
			{
				name: 'long',
				ttl: 60000,
				limit: 100
			}
		]),
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				GATEWAY_PORT: Joi.number().default(3000),
				RMQ_USER: Joi.string().required(),
				RMQ_PASSWORD: Joi.string().required(),
				RMQ_PORT: Joi.number().required(),
				RMQ_VHOST: Joi.string().required(),
				RMQ_HOST: Joi.string().required(),
				PG_USER: Joi.string().required(),
				PG_PASSWORD: Joi.string().required(),
				PG_DB: Joi.string().required(),
				PG_PORT: Joi.number().required(),
				PG_HOST: Joi.string().required(),
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION_IN_SECONDS: Joi.number().required(),
				INITIAL_ADMIN_EMAIL: Joi.string().required(),
				INITIAL_ADMIN_PASSWORD: Joi.string().required(),
				REDIS_HOST: Joi.string().required(),
				REDIS_PORT: Joi.string().required(),
				MONGO_USER: Joi.string().required(),
				MONGO_PASSWORD: Joi.string().required(),
				MONGO_PORT: Joi.number().required(),
				MONGO_DB: Joi.string().required(),
				MONGO_HOST: Joi.string().required()
			})
		}),
		PostgresModule,
		MongoModule,
		RedisModule,
		IngestionModule,
		UsersModule,
		EventsModule,
		AuthModule,
		StreamingModule,
		MachinesModule,
		AlertsModule,
		SharedRulesModule,
		LogSearchModule,
		SharedNotificationsPreferencesModule
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		},
		AppService
	]
})
export class AppModule {}
