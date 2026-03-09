import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ENV_VARS } from '@sentinel-supreme/shared'
import Joi from 'joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { EventsModule } from './events/events.module'
import { LogsModule } from './logs/logs.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				PORT: Joi.number().default(3000),
				RABBITMQ_USER: Joi.string().required(),
				RABBITMQ_PASSWORD: Joi.string().required(),
				RABBITMQ_PORT: Joi.number().required(),
				RABBITMQ_VHOST: Joi.string().required(),
				POSTGRES_USER: Joi.string().required(),
				POSTGRES_PASSWORD: Joi.string().required(),
				POSTGRES_DB: Joi.string().required(),
				POSTGRES_PORT: Joi.number().required(),
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION_IN_SECONDS: Joi.number().required()
			})
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'postgres',
				url: `postgres://${config.get(ENV_VARS.POSTGRES_USER)}:${config.get(ENV_VARS.POSTGRES_PASSWORD)}@localhost:${config.get(ENV_VARS.POSTGRES_PORT)}/${config.get(ENV_VARS.POSTGRES_DB)}`,
				autoLoadEntities: true,
				// TODO: Change for prod!
				synchronize: true
			})
		}),
		LogsModule,
		UsersModule,
		EventsModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
