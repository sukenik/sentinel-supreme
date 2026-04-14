import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module'
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
				RMQ_HOST: Joi.string().required(),
				GEMINI_API_KEY: Joi.string().required()
			})
		}),
		AiAnalysisModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
