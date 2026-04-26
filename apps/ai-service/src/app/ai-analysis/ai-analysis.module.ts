import { Module } from '@nestjs/common'
import { AiConfigModule } from '@sentinel-supreme/shared/server'
import { GeminiEmbeddingModule } from '../gemini-embedding/gemini-embedding.module'
import { VectorDbModule } from '../vector-db/vector-db.module'
import { AiAnalysisService } from './ai-analysis.service'

@Module({
	imports: [AiConfigModule, GeminiEmbeddingModule, VectorDbModule],
	providers: [AiAnalysisService],
	exports: [AiAnalysisService]
})
export class AiAnalysisModule {}
