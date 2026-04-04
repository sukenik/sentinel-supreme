import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Log, LogSearchDto } from '@sentinel-supreme/shared/server'
import { Model, QueryFilter } from 'mongoose'

@Injectable()
export class LogSearchService {
	constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

	async search(dto: LogSearchDto) {
		const { searchTerm, sourceIp, serviceName, page, limit } = dto
		const skip = (page - 1) * limit

		const query: QueryFilter<Log> = {}

		if (sourceIp) {
			query.sourceIp = sourceIp
		}

		if (serviceName) {
			query.serviceName = serviceName
		}

		if (searchTerm) {
			query.$text = { $search: searchTerm }
		}

		const [data, total] = await Promise.all([
			this.logModel
				.find(query)
				.sort(searchTerm ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.exec(),
			this.logModel.countDocuments(query).exec()
		])

		return {
			data,
			meta: {
				total,
				page,
				limit,
				lastPage: Math.ceil(total / limit)
			}
		}
	}
}
