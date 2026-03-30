import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { tRule } from '@sentinel-supreme/shared'
import { CreateRuleDto } from '@sentinel-supreme/shared/server'
import Redis from 'ioredis'
import { Repository } from 'typeorm'
import { RuleEntity } from './entities/rules.entity'

@Injectable()
export class RulesGatewayService {
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
		await this.redis.publish('RULES_UPDATED', Date.now().toString())
	}
}
