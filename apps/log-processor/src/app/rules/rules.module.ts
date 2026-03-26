import { Module } from '@nestjs/common'
import { SharedAlertsModule } from '@sentinel-supreme/shared/server'
import { ExternalApiModule } from '../external-api/external-api.module'
import { RulesService } from './rules.service'

@Module({
	imports: [ExternalApiModule, SharedAlertsModule],
	providers: [RulesService],
	exports: [RulesService]
})
export class RulesModule {}
