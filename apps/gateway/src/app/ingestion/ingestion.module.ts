import { Module } from '@nestjs/common'
import { DL_CONFIG, LOG_DLX, QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { GATEWAY_CLIENT } from '../consts'
import { MachinesModule } from '../machines/machines.module'
import { IngestionController } from './ingestion.controller'

@Module({
	imports: [
		SharedRmqModule.register(GATEWAY_CLIENT, QUEUES.LOGS, true, {
			arguments: {
				[DL_CONFIG.DLX_HEADER]: LOG_DLX.DLX_NAME,
				[DL_CONFIG.DL_ROUTING_KEY_HEADER]: LOG_DLX.DL_ROUTING_KEY
			}
		}),
		MachinesModule
	],
	controllers: [IngestionController]
})
export class IngestionModule {}
