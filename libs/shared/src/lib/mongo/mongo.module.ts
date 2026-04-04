import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ENV_VARS } from '../consts'

@Global()
@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				uri: `mongodb://${config.getOrThrow(ENV_VARS.MONGO_USER)}:${config.getOrThrow(ENV_VARS.MONGO_PASSWORD)}@${config.getOrThrow(ENV_VARS.MONGO_HOST)}:${config.getOrThrow(ENV_VARS.MONGO_PORT)}/${config.getOrThrow(ENV_VARS.MONGO_DB)}?authSource=admin`
			})
		})
	],
	exports: [MongooseModule]
})
export class MongoModule {}
