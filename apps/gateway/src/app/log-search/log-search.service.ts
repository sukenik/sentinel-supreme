import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { eLogLevel, iLogSearchReturnType } from '@sentinel-supreme/shared'
import { Log, LogSearchDto } from '@sentinel-supreme/shared/server'
import { Expression, Model, QueryFilter } from 'mongoose'

interface iAggregateResult {
	data: Log[]
	stats: { _id: eLogLevel; count: number }[]
	totalCount: { count: number }[]
	timeline: { _id: Date; count: number }[]
}

@Injectable()
export class LogSearchService {
	constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

	async search(dto: LogSearchDto): Promise<iLogSearchReturnType> {
		const { searchTerm, sourceIp, serviceName, page, limit } = dto
		const skip = (page - 1) * limit

		const query: QueryFilter<Log> = {}
		if (sourceIp) query.sourceIp = sourceIp
		if (serviceName) query.serviceName = serviceName
		if (searchTerm) query.$text = { $search: searchTerm }

		const sortStage: Record<string, -1 | Expression.Meta> = searchTerm
			? { score: { $meta: 'textScore' } }
			: { createdAt: -1 }

		const result = await this.logModel
			.aggregate<iAggregateResult>([
				{ $match: query },
				{
					$facet: {
						data: [
							...(searchTerm
								? [{ $addFields: { score: { $meta: 'textScore' } } }]
								: []),
							{ $sort: sortStage },
							{ $skip: skip },
							{ $limit: limit }
						],
						stats: [
							{
								$group: {
									_id: '$level',
									count: { $sum: 1 }
								}
							}
						],
						totalCount: [{ $count: 'count' }],
						timeline: [
							{
								$group: {
									_id: {
										$dateTrunc: {
											date: '$createdAt',
											unit: 'hour'
										}
									},
									count: { $sum: 1 }
								}
							},
							{ $sort: { _id: 1 } }
						]
					}
				}
			])
			.exec()

		const facetResult = result[0]

		const timeline = facetResult.timeline.map((t) => ({
			time: t._id,
			count: t.count
		}))

		const stats = (facetResult.stats || []).reduce((acc: Record<string, number>, curr) => {
			acc[curr._id] = curr.count
			return acc
		}, {})

		const total = facetResult.totalCount?.[0]?.count || 0

		return {
			data: facetResult.data,
			stats,
			timeline,
			meta: {
				total,
				page,
				limit,
				lastPage: Math.ceil(total / limit)
			}
		}
	}
}
