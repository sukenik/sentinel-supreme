import { InjectRedis } from '@nestjs-modules/ioredis'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import Redis from 'ioredis'
import { MACHINE_KEY_REQ_HEADER, REDIS_MACHINE_KEY_PREFIX } from '../../consts'

@Injectable()
export class ApiKeyGuard implements CanActivate {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		const apiKey = request.headers[MACHINE_KEY_REQ_HEADER]

		if (!apiKey) {
			throw new UnauthorizedException('API Key is missing')
		}

		const machineData = await this.redis.get(`${REDIS_MACHINE_KEY_PREFIX}${apiKey}`)

		if (!machineData) {
			throw new UnauthorizedException('Invalid API Key')
		}

		request.machine = JSON.parse(machineData)

		return true
	}
}
