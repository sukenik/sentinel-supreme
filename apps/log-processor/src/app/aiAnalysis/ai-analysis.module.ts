import { Module } from '@nestjs/common'
import { QUEUES } from '@sentinel-supreme/shared'
import { SharedAlertsModule, SharedRmqModule } from '@sentinel-supreme/shared/server'
import { ALERTS_CLIENT } from '../consts'
import { AiAnalysisController } from './ai-analysis.controller'

@Module({
	imports: [SharedAlertsModule, SharedRmqModule.register(ALERTS_CLIENT, QUEUES.UI_UPDATES)],
	controllers: [AiAnalysisController]
})
export class AiAnalysisModule {}
