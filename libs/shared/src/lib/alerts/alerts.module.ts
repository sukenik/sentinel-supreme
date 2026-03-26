import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlertsService } from './alerts.service'
import { AlertEntity } from './entities/alert.entity'

@Module({
	imports: [TypeOrmModule.forFeature([AlertEntity])],
	providers: [AlertsService],
	exports: [AlertsService, TypeOrmModule]
})
export class SharedAlertsModule {}
