import { Module } from '@nestjs/common'
import { SharedAlertsModule } from '@sentinel-supreme/shared/server'
import { AlertsController } from './alerts.controller'

@Module({
	imports: [SharedAlertsModule],
	controllers: [AlertsController]
})
export class AlertsModule {}
