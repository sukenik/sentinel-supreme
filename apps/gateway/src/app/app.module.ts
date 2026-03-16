import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ENV_VARS } from '@sentinel-supreme/shared'
import Joi from 'joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { EventsModule } from './events/events.module'
import { IngestionModule } from './ingestion/ingestion.module'
import { StreamingModule } from './streaming/streaming.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{
				name: 'short',
				ttl: 1000,
				limit: 10
			},
			{
				name: 'long',
				ttl: 60000,
				limit: 100
			}
		]),
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				GATEWAY_PORT: Joi.number().default(3000),
				RMQ_USER: Joi.string().required(),
				RMQ_PASSWORD: Joi.string().required(),
				RMQ_PORT: Joi.number().required(),
				RMQ_VHOST: Joi.string().required(),
				PG_USER: Joi.string().required(),
				PG_PASSWORD: Joi.string().required(),
				PG_DB: Joi.string().required(),
				PG_PORT: Joi.number().required(),
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION_IN_SECONDS: Joi.number().required()
			})
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'postgres',
				url: `postgres://${config.get(ENV_VARS.PG_USER)}:${config.get(ENV_VARS.PG_PASSWORD)}@localhost:${config.get(ENV_VARS.PG_PORT)}/${config.get(ENV_VARS.PG_DB)}`,
				autoLoadEntities: true,
				// TODO: Change for prod!
				synchronize: true
			})
		}),
		IngestionModule,
		UsersModule,
		EventsModule,
		AuthModule,
		StreamingModule
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		},
		AppService
	]
})
export class AppModule {}
