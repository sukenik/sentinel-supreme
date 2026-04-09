import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { NotificationOrchestratorModule } from './notification-orchestrator/notification-orchestrator.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				RMQ_USER: Joi.string().required(),
				RMQ_PASSWORD: Joi.string().required(),
				RMQ_PORT: Joi.number().required(),
				RMQ_VHOST: Joi.string().required(),
				RMQ_HOST: Joi.string().required(),
				SMTP_HOST: Joi.string().required(),
				SMTP_PORT: Joi.number().required(),
				SMTP_USER: Joi.string().required(),
				SMTP_PASS: Joi.string().required(),
				SLACK_WEBHOOK_URL: Joi.string().required(),
				DISCORD_WEBHOOK_URL: Joi.string().required()
			})
		}),
		NotificationOrchestratorModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
