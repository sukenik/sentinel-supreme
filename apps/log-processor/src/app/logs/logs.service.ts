import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateLogDto } from '@sentinel-supreme/shared'
import * as crypto from 'crypto'
import { Model } from 'mongoose'
import { Subject } from 'rxjs'
import { bufferTime, filter } from 'rxjs/operators'
import { Log, iLog } from './schemas/log.schema'

@Injectable()
export class LogsService implements OnModuleDestroy {
	private readonly logger = new Logger(LogsService.name)
	private readonly logBuffer$ = new Subject<iLog>()

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
						await this.logModel.insertMany(logs, { ordered: false })

						this.logger.log(`✅ Bulk Insert: Saved ${logs.length} logs to MongoDB`)
					} catch (error) {
						const mongoError = error as { code?: number }

						if (mongoError.code === 11000) {
							this.logger.warn('⚠️ Some duplicate logs were skipped')
						} else {
							this.logger.error('❌ Failed to bulk insert logs', error)
						}
					}
				}
			})
	}

	private createFingerprint(data: CreateLogDto): string {
		const logDate = data.createdAt ? new Date(data.createdAt) : new Date()
		const timeBucket = Math.floor(logDate.getTime() / 5000)

		const str = `${data.service}-${data.level}-${data.message}-${JSON.stringify(data.metadata || {})}-${timeBucket}`

		return crypto.createHash('md5').update(str).digest('hex')
	}

	async saveLog(data: CreateLogDto): Promise<void> {
		const fingerprint = this.createFingerprint(data)

		this.logBuffer$.next({ ...data, fingerprint })
	}

	onModuleDestroy() {
		this.logBuffer$.complete()
	}
}
