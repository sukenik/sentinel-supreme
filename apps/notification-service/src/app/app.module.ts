import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				RMQ_USER: Joi.string().required(),
				RMQ_PASSWORD: Joi.string().required(),
				RMQ_PORT: Joi.number().required(),
				RMQ_VHOST: Joi.string().required(),
				RMQ_HOST: Joi.string().required()
			})
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
