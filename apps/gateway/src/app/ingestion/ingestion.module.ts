import { Module } from '@nestjs/common'
import { DL_CONFIG, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { GATEWAY_CLIENT } from '../consts'
import { MachinesModule } from '../machines/machines.module'
import { IngestionController } from './ingestion.controller'

@Module({
	imports: [
		SharedRmqModule.register(GATEWAY_CLIENT, QUEUES.LOGS, true, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: DL_CONFIG.DLX_EXCHANGE,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: DL_CONFIG.DL_ROUTING_KEY
			}
		}),
		MachinesModule
	],
	controllers: [IngestionController]
})
export class IngestionModule {}
