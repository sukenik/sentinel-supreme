import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateLogDto } from '@sentinel-supreme/shared'
import { Model } from 'mongoose'
import { Log } from './schemas/log.schema'

@Injectable()
export class LogsService {
	constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

	async saveLog(data: CreateLogDto): Promise<Log> {
		const newLog = new this.logModel(data)
		return newLog.save()
	}
}
