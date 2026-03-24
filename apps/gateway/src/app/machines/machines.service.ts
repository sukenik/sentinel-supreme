import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { iMachine } from '@sentinel-supreme/shared'
import Redis from 'ioredis'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { REDIS_MACHINE_KEY_PREFIX } from '../consts'
import { Machine } from './entities/machine.entity'

@Injectable()
export class MachinesService {
	constructor(
		@InjectRepository(Machine)
		private readonly machineRepo: Repository<iMachine>,
		@InjectRedis() private readonly redis: Redis
	) {}

	async createMachine(name: string) {
		const apiKey = `sk_${uuidv4().replace(/-/g, '')}`

		const machine = this.machineRepo.create({
			name,
			apiKey
		})
		await this.machineRepo.save(machine)

		await this.redis.set(
			`${REDIS_MACHINE_KEY_PREFIX}${apiKey}`,
			JSON.stringify({ id: machine.id, name: machine.name })
		)

		return { machine, apiKey }
	}

	async revokeMachine(id: string) {
		const machine = await this.machineRepo.findOneBy({ id })

		if (machine) {
			await this.redis.del(`${REDIS_MACHINE_KEY_PREFIX}${machine.apiKey}`)
			machine.isActive = false
			await this.machineRepo.save(machine)
		}
	}

	async getAll() {
		return this.machineRepo.find({
			order: { createdAt: 'DESC' }
		})
	}

	async getByApiKey(apiKey: string): Promise<iMachine | null> {
		const machine = await this.machineRepo.findOne({
			where: { apiKey, isActive: true }
		})

		return machine
	}
}
