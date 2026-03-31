import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ENV_VARS } from '../consts'

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'postgres',
				url: `postgres://${config.getOrThrow(ENV_VARS.PG_USER)}:${config.getOrThrow(ENV_VARS.PG_PASSWORD)}@${config.getOrThrow(ENV_VARS.PG_HOST)}:${config.getOrThrow(ENV_VARS.PG_PORT)}/${config.getOrThrow(ENV_VARS.PG_DB)}`,
				autoLoadEntities: true,
				// TODO: Change for prod!
				synchronize: true,
				extra: {
					max: 20,
					idleTimeoutMillis: 30000,
					connectionTimeoutMillis: 2000
				}
			})
		})
	],
	exports: [TypeOrmModule]
})
export class PostgresModule {}
