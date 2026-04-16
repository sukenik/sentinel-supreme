import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AI_ANALYSIS_RESULTS_DLX, DL_CONFIG, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import * as Joi from 'joi'
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AI_ANALYSIS_CLIENT } from './consts'

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
		SharedRmqModule.register(AI_ANALYSIS_CLIENT, QUEUES.AI_ANALYSIS_RESULTS, true, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: AI_ANALYSIS_RESULTS_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: AI_ANALYSIS_RESULTS_DLX.DL_ROUTING_KEY
			}
		}),
		AiAnalysisModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
