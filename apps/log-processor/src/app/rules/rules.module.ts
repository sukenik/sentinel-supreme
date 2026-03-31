import { Module } from '@nestjs/common'
import { QUEUES } from '@sentinel-supreme/shared'
import {
	RedisModule,
	SharedAlertsModule,
	SharedRmqModule,
	SharedRulesModule
} from '@sentinel-supreme/shared/server'
import { ALERTS_CLIENT } from '../consts'
import { ExternalApiModule } from '../external-api/external-api.module'
import { RulesEngineService } from './rules.service'

@Module({
	imports: [
		SharedRmqModule.register(ALERTS_CLIENT, QUEUES.UI_UPDATES),
		RedisModule,
		ExternalApiModule,
		SharedAlertsModule,
		SharedRulesModule
	],
	providers: [RulesEngineService],
	exports: [RulesEngineService]
})
export class RulesModule {}
