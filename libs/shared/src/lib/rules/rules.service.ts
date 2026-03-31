import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { REDIS_CHANNELS } from '../consts'
import { tRule } from '../rules.types'
import { CreateRuleDto } from '@sentinel-supreme/shared/server'
import Redis from 'ioredis'
import { Repository } from 'typeorm'
import { RuleEntity } from './entities/rules.entity'

@Injectable()
export class RulesManagerService {
	constructor(
		@InjectRepository(RuleEntity) private repo: Repository<RuleEntity>,
		@InjectRedis() private readonly redis: Redis
	) {}

	async create(dto: CreateRuleDto) {
		const rule = await this.repo.save(this.repo.create(dto))
		await this.notifyProcessors()
		return rule
	}

	async getAll(): Promise<tRule[]> {
		const rules = (await this.repo.find()) as tRule[]
		return rules
	}

	async getAllActiveRules(): Promise<tRule[]> {
		const rules = (await this.repo.find({
			where: { isActive: true }
		})) as tRule[]
		return rules
	}

	async deleteById(id: string) {
		await this.repo.delete(id)
	}

	async update(id: string, dto: CreateRuleDto) {
		await this.repo.update(id, dto)
		const updated = await this.repo.findOneBy({ id })
		await this.notifyProcessors()
		return updated
	}

	private async notifyProcessors() {
		const activeRules = await this.getAllActiveRules()
		await this.redis.publish(REDIS_CHANNELS.RULES_UPDATED, JSON.stringify(activeRules))
	}
}
