import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Cron } from '@nestjs/schedule'
import { ENV_VARS } from '@sentinel-supreme/shared'
import { Log } from '@sentinel-supreme/shared/server'
import { Model } from 'mongoose'

@Injectable()
export class RetentionService {
	private readonly logger = new Logger(RetentionService.name)

	constructor(
		@InjectModel(Log.name) private logModel: Model<Log>,
		private configService: ConfigService
	) {}

	@Cron('0 2 * * *')
	async handleLogCleanup() {
		this.logger.log('--- Database Maintenance: Starting Log Retention Policy ---')

		const retentionDays = this.configService.getOrThrow<number>(ENV_VARS.LOG_RETENTION_DAYS)
		const cutoffDate = new Date()
		cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

		try {
			const result = await this.logModel.deleteMany({
				createdAt: { $lt: cutoffDate }
			})

			if (result.deletedCount > 0) {
				this.logger.log(
					`Success: Purged ${result.deletedCount} records older than ${cutoffDate.toISOString()}`
				)
			} else {
				this.logger.log('No old logs found to purge.')
			}
		} catch (error) {
			const { stack } = error as { stack: string }
			this.logger.error('Failed to execute log retention cleanup', stack)
		}

		this.logger.log('--- Database Maintenance: Completed ---')
	}
}
