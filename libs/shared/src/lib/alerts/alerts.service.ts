import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { iAlert } from '../types'
import { AlertEntity } from './entities/alert.entity'

@Injectable()
export class AlertsService {
	constructor(
		@InjectRepository(AlertEntity)
		private readonly repo: Repository<iAlert>
	) {}

	async create(alertData: iAlert): Promise<iAlert> {
		const newAlert = this.repo.create(alertData)
		const saved = await this.repo.save(newAlert)
		return saved
	}

	async findAll(limit = 50): Promise<iAlert[]> {
		return this.repo.find({
			order: { createdAt: 'DESC' },
			take: limit
		})
	}

	async markAsRead(id: string): Promise<void> {
		await this.repo.update(id, { isRead: true })
	}
}
