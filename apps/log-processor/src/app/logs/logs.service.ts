import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateLogDto } from '@sentinel-supreme/shared'
import { Model } from 'mongoose'
import { Subject } from 'rxjs'
import { bufferTime, filter } from 'rxjs/operators'
import { Log } from './schemas/log.schema'

@Injectable()
export class LogsService implements OnModuleDestroy {
	private readonly logger = new Logger(LogsService.name)
	private readonly logBuffer$ = new Subject<CreateLogDto>()

	constructor(@InjectModel(Log.name) private logModel: Model<Log>) {
		this.initBuffer()
	}

	private initBuffer() {
		this.logBuffer$
			.pipe(
				bufferTime(5000, undefined, 50),
				filter((logs) => logs.length > 0)
			)
			.subscribe({
				next: async (logs) => {
					try {
						await this.logModel.insertMany(logs)

						this.logger.log(`✅ Bulk Insert: Saved ${logs.length} logs to MongoDB`)
					} catch (err) {
						this.logger.error('❌ Failed to bulk insert logs', err)
					}
				}
			})
	}

	async saveLog(data: CreateLogDto): Promise<void> {
		this.logBuffer$.next(data)
	}

	onModuleDestroy() {
		this.logBuffer$.complete()
	}
}
