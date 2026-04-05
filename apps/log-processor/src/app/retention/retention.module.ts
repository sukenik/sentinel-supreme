import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Log, LogSchema } from '@sentinel-supreme/shared/server'
import { RetentionService } from './retention.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
	providers: [RetentionService],
	exports: [RetentionService]
})
export class RetentionModule {}
