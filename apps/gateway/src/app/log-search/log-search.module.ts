import { Module } from '@nestjs/common'
import { LogsSearchController } from './log-search.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Log, LogSchema } from '@sentinel-supreme/shared/server'
import { LogSearchService } from './log-search.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
	controllers: [LogsSearchController],
	providers: [LogSearchService],
	exports: [LogSearchService]
})
export class LogSearchModule {}
