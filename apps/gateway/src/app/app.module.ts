import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import Joi from 'joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LogsModule } from './logs/logs.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				PORT: Joi.number().default(3000),
				RABBITMQ_URL: Joi.string().required()
			})
		}),
		LogsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
