import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemEvent } from './entities/event.entity'

@Module({
	imports: [TypeOrmModule.forFeature([SystemEvent])],
	exports: [TypeOrmModule]
})
export class EventsModule {}
