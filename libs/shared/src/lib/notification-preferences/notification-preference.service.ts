import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import Redis from 'ioredis'
import { Repository } from 'typeorm'
import { REDIS_CHANNELS } from '../consts'
import { eSeverity } from '../rules.types'
import { eNotificationChannel, iNotificationPreference } from '../types'
import { NotificationPreferenceEntity } from './entities/notification-preference.entity'

@Injectable()
export class NotificationsPreferencesService {
	constructor(
		@InjectRepository(NotificationPreferenceEntity)
		private repo: Repository<NotificationPreferenceEntity>,
		@InjectRedis() private readonly redis: Redis
	) {}

	async getAll(): Promise<iNotificationPreference[]> {
		const notificationPreferences = await this.repo.find()
		return notificationPreferences
	}

	async getAllEnabledNotificationPreferences(): Promise<iNotificationPreference[]> {
		const notificationPreferences = await this.repo.find({
			where: { isEnabled: true }
		})
		return notificationPreferences
	}

	async upsert(dto: iNotificationPreference): Promise<iNotificationPreference[]> {
		const existing = await this.repo.findOneBy({
			userEmail: dto.userEmail,
			severity: dto.severity,
			channel: dto.channel
		})

		if (existing) {
			await this.repo.update(existing.id, { isEnabled: dto.isEnabled })
		} else {
			await this.repo.save(this.repo.create(dto))
		}

		await this.notifyProcessors()
		return this.getAll()
	}

	private async notifyProcessors() {
		const enabledNotificationPreferences = await this.getAllEnabledNotificationPreferences()
		await this.redis.publish(
			REDIS_CHANNELS.NOTIFICATIONS_PREFERENCES_UPDATED,
			JSON.stringify(enabledNotificationPreferences)
		)
	}

	async setGlobalMute(userEmail: string, isMuted: boolean) {
		await this.repo.upsert(
			{
				userEmail,
				severity: eSeverity.ALL,
				channel: eNotificationChannel.GLOBAL,
				isEnabled: !isMuted
			},
			['userEmail', 'severity', 'channel']
		)

		await this.redis.publish(
			REDIS_CHANNELS.GLOBAL_MUTE_UPDATED,
			JSON.stringify({ userEmail, isMuted })
		)

		return { userEmail, isMuted }
	}

	async getGlobalMuteStatusByUser(userEmail: string): Promise<boolean> {
		const config = await this.repo.findOneBy({
			userEmail,
			severity: eSeverity.ALL,
			channel: eNotificationChannel.GLOBAL
		})

		return config ? !config.isEnabled : false
	}

	async getAllMutedUsers(): Promise<NotificationPreferenceEntity[]> {
		return this.repo.find({
			where: {
				channel: eNotificationChannel.GLOBAL,
				isEnabled: false
			}
		})
	}
}
