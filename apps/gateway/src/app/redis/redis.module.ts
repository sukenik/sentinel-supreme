import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis'
import { ENV_VARS } from '@sentinel-supreme/shared'

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
	exports: [NestRedisModule]
})
export class RedisModule {}
