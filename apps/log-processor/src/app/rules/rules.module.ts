import { Module } from '@nestjs/common'
import { QUEUES } from '@sentinel-supreme/shared'
import { SharedAlertsModule, SharedRmqModule } from '@sentinel-supreme/shared/server'
import { ALERTS_CLIENT } from '../consts'
import { ExternalApiModule } from '../external-api/external-api.module'
import { RulesService } from './rules.service'

@Module({
	imports: [
		SharedRmqModule.register(ALERTS_CLIENT, QUEUES.UI_UPDATES),
		ExternalApiModule,
		SharedAlertsModule
	],
	providers: [RulesService],
	exports: [RulesService]
})
export class RulesModule {}
