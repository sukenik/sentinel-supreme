import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ENV_VARS } from '@sentinel-supreme/shared'
import { DashboardStreamGateway } from './streaming.gateway'
import { RmqStreamBridge } from './streaming.listener'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.getOrThrow(ENV_VARS.JWT_SECRET),
				signOptions: { expiresIn: config.getOrThrow(ENV_VARS.JWT_EXPIRATION_IN_SECONDS) }
			})
		})
	],
	controllers: [RmqStreamBridge],
	providers: [DashboardStreamGateway],
	exports: [DashboardStreamGateway]
})
export class StreamingModule {}
