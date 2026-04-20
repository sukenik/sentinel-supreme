import { Module } from '@nestjs/common'
import { AiConfigModule } from '@sentinel-supreme/shared/server'
import { AiAnalysisService } from './ai-analysis.service'

@Module({
	imports: [AiConfigModule],
	providers: [AiAnalysisService],
	exports: [AiAnalysisService]
})
export class AiAnalysisModule {}
