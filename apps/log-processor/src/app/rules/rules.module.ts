import { Module } from '@nestjs/common'
import { AI_ANALYSIS_DLX, DL_CONFIG, NOTIFICATIONS_DLX, QUEUES } from '@sentinel-supreme/shared'
import {
	RedisModule,
	SharedAlertsModule,
	SharedNotificationsPreferencesModule,
	SharedRmqModule,
	SharedRulesModule
} from '@sentinel-supreme/shared/server'
import { AI_ANALYSIS_CLIENT, ALERTS_CLIENT, NOTIFICATIONS_CLIENT } from '../consts'
import { ExternalApiModule } from '../external-api/external-api.module'
import { RulesEngineService } from './rules.service'

@Module({
	imports: [
		SharedRmqModule.register(ALERTS_CLIENT, QUEUES.UI_UPDATES),
		SharedRmqModule.register(NOTIFICATIONS_CLIENT, QUEUES.NOTIFICATIONS, true, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: NOTIFICATIONS_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: NOTIFICATIONS_DLX.DL_ROUTING_KEY
			}
		}),
		SharedRmqModule.register(AI_ANALYSIS_CLIENT, QUEUES.AI_ANALYSIS, true, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: AI_ANALYSIS_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: AI_ANALYSIS_DLX.DL_ROUTING_KEY
			}
		}),
		RedisModule,
		ExternalApiModule,
		SharedAlertsModule,
		SharedRulesModule,
		SharedNotificationsPreferencesModule
	],
	providers: [RulesEngineService],
	exports: [RulesEngineService]
})
export class RulesModule {}
