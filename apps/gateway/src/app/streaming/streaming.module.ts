import { Module } from '@nestjs/common'
import { DashboardStreamGateway } from './streaming.gateway'
import { RmqStreamBridge } from './streaming.listener'

@Module({
	controllers: [RmqStreamBridge],
	providers: [DashboardStreamGateway],
	exports: [DashboardStreamGateway]
})
export class StreamingModule {}
