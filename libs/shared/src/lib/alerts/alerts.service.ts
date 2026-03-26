import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AlertEntity } from './entities/alert.entity'
import { iAlert } from '../types'

@Injectable()
export class AlertsService {
	private readonly logger = new Logger(AlertsService.name)

	constructor(
		@InjectRepository(AlertEntity)
		private readonly repo: Repository<AlertEntity>
	) {}

	async create(alertData: iAlert): Promise<AlertEntity> {
		const newAlert = this.repo.create(alertData)
		const saved = await this.repo.save(newAlert)
		this.logger.log(`✅ Alert saved to DB: ${saved.id}`)
		return saved
	}

	async findAll(limit = 50): Promise<AlertEntity[]> {
		return this.repo.find({
			order: { createdAt: 'DESC' },
			take: limit
		})
	}

	async markAsRead(id: string): Promise<void> {
		await this.repo.update(id, { isRead: true })
	}
}
