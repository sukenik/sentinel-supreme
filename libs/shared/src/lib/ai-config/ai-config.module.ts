import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AiConfigController } from './ai-config.controller'
import { AiConfigService } from './ai-config.service'
import { AiConfigEntity } from './entities/ai-config.entity'

@Module({
	imports: [TypeOrmModule.forFeature([AiConfigEntity])],
	controllers: [AiConfigController],
	providers: [AiConfigService],
	exports: [AiConfigService]
})
export class AiConfigModule {}
