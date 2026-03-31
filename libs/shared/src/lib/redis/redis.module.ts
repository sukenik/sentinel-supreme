import { RedisModule as NestRedisModule, getRedisConnectionToken } from '@nestjs-modules/ioredis'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { ENV_VARS, REDIS_SUBSCRIBER } from '../consts'

@Global()
@Module({
	imports: [
		NestRedisModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'single',
				url: `redis://${configService.getOrThrow(ENV_VARS.REDIS_HOST)}:${configService.getOrThrow(ENV_VARS.REDIS_PORT)}`
			})
		})
	],
	providers: [
		{
			provide: REDIS_SUBSCRIBER,
			inject: [getRedisConnectionToken()],
			useFactory: (redis: Redis) => {
				return redis.duplicate()
			}
		}
	],
	exports: [NestRedisModule, REDIS_SUBSCRIBER]
})
export class RedisModule {}
