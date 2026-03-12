import { Module } from '@nestjs/common'
import { LogsGateway } from './logs.gateway'
import { LogsUIListener } from './logs-ui.listener'

@Module({
	controllers: [LogsUIListener],
	providers: [LogsGateway],
	exports: [LogsGateway]
})
export class WebsocketModule {}
