import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongoModule, PostgresModule, RedisModule } from '@sentinel-supreme/shared/server'
import * as Joi from 'joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LogsModule } from './logs/logs.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
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
				PG_HOST: Joi.string().required()
			})
		}),
		MongoModule,
		RedisModule,
		PostgresModule,
		LogsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
