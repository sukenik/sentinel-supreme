import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QUEUES } from '@sentinel-supreme/shared'
import { SharedRmqModule } from '@sentinel-supreme/shared/server'
import { PROCESSOR_CLIENT } from '../consts'
import { RulesModule } from '../rules/rules.module'
import { LogsController } from './logs.controller'
import { LogsService } from './logs.service'
import { Log, LogSchema } from './schemas/log.schema'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
		SharedRmqModule.register(PROCESSOR_CLIENT, QUEUES.UI_UPDATES),
		RulesModule
	],
	providers: [LogsService],
	controllers: [LogsController]
})
export class LogsModule {}
