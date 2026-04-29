import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { appConfig } from '@sentinel-supreme/shared'
import { MongoModule, PostgresModule, RedisModule } from '@sentinel-supreme/shared/server'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'
import * as Joi from 'joi'
import { AiAnalysisModule } from './aiAnalysis/ai-analysis.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LogsModule } from './logs/logs.module'
import { RetentionModule } from './retention/retention.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				LOG_PROCESSOR_PORT: Joi.number().required(),
				MONGO_USER: Joi.string().required(),
				MONGO_PASSWORD: Joi.string().required(),
				MONGO_PORT: Joi.number().required(),
				MONGO_DB: Joi.string().required(),
				MONGO_HOST: Joi.string().required(),
				RMQ_USER: Joi.string().required(),
				RMQ_PASSWORD: Joi.string().required(),
				RMQ_PORT: Joi.number().required(),
				RMQ_VHOST: Joi.string().required(),
				RMQ_HOST: Joi.string().required(),
				REDIS_HOST: Joi.string().required(),
				REDIS_PORT: Joi.string().required(),
				VIRUSTOTAL_API_KEY: Joi.string().required(),
				PG_USER: Joi.string().required(),
				PG_PASSWORD: Joi.string().required(),
				PG_DB: Joi.string().required(),
				PG_PORT: Joi.number().required(),
				PG_HOST: Joi.string().required(),
				LOG_RETENTION_DAYS: Joi.number().required()
			})
		}),
		PrometheusModule.register({
			path: appConfig.PROMETHEUS_ENDPOINT
		}),
		ScheduleModule.forRoot(),
		MongoModule,
		RedisModule,
		PostgresModule,
		LogsModule,
		RetentionModule,
		AiAnalysisModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
