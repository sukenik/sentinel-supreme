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
				PORT: Joi.number().default(3001),
				MONGO_USER: Joi.string().required(),
				MONGO_PASSWORD: Joi.string().required(),
				MONGO_PORT: Joi.number().required(),
				MONGO_DB: Joi.string().required(),
				RABBITMQ_USER: Joi.string().required(),
				RABBITMQ_PASSWORD: Joi.string().required(),
				RABBITMQ_PORT: Joi.number().required(),
				RABBITMQ_VHOST: Joi.string().required()
			})
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				uri: `mongodb://${config.get(ENV_VARS.MONGO_USER)}:${config.get(ENV_VARS.MONGO_PASSWORD)}@localhost:${config.get(ENV_VARS.MONGO_PORT)}/${config.get(ENV_VARS.MONGO_DB)}?authSource=admin`
			})
		}),
		LogsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
