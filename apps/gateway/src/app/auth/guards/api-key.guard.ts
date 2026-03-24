import { InjectRedis } from '@nestjs-modules/ioredis'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import Redis from 'ioredis'
import { MACHINE_KEY_REQ_HEADER, REDIS_MACHINE_KEY_PREFIX } from '../../consts'
import { MachinesService } from '../../machines/machines.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
	constructor(
		@InjectRedis() private readonly redis: Redis,
		private readonly machinesService: MachinesService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const apiKey = request.headers[MACHINE_KEY_REQ_HEADER]

		if (!apiKey) {
			throw new UnauthorizedException('API Key is missing')
		}

		const redisKey = `${REDIS_MACHINE_KEY_PREFIX}${apiKey}`

		let machineData = await this.redis.get(redisKey)

		if (!machineData) {
			const machine = await this.machinesService.getByApiKey(apiKey)

			if (!machine) throw new UnauthorizedException('Invalid API Key')

			machineData = JSON.stringify({ id: machine.id, name: machine.name })
			await this.redis.set(redisKey, machineData)
		}

		request.machine = JSON.parse(machineData)
		return true
	}
}
