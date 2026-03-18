import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ENV_VARS } from '@sentinel-supreme/shared'
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
				RMQ_HOST: Joi.string().required()
			})
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				uri: `mongodb://${config.getOrThrow(ENV_VARS.MONGO_USER)}:${config.getOrThrow(ENV_VARS.MONGO_PASSWORD)}@${config.getOrThrow(ENV_VARS.MONGO_HOST)}:${config.getOrThrow(ENV_VARS.MONGO_PORT)}/${config.getOrThrow(ENV_VARS.MONGO_DB)}?authSource=admin`
			})
		}),
		LogsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
