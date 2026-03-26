import { Module } from '@nestjs/common'
import { ExternalApiModule } from '../external-api/external-api.module'
import { RulesService } from './rules.service'

@Module({
	imports: [ExternalApiModule],
	providers: [RulesService],
	exports: [RulesService]
})
export class RulesModule {}
