import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationPreferenceEntity } from './entities/notification-preference.entity'
import { NotificationsPreferencesController } from './notification-preference.controller'
import { NotificationsPreferencesService } from './notification-preference.service'

@Module({
	imports: [TypeOrmModule.forFeature([NotificationPreferenceEntity])],
	controllers: [NotificationsPreferencesController],
	providers: [NotificationsPreferencesService],
	exports: [NotificationsPreferencesService, TypeOrmModule]
})
export class SharedNotificationsPreferencesModule {}
