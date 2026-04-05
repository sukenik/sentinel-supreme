import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { eLogLevel, iLogSearchReturnType } from '@sentinel-supreme/shared'
import { Log, LogSearchDto } from '@sentinel-supreme/shared/server'
import { Model, QueryFilter, Types } from 'mongoose'

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
		const { searchTerm, sourceIp, serviceName, lastId, limit } = dto

		const globalQuery: QueryFilter<Log> = {}
		if (sourceIp) globalQuery.sourceIp = sourceIp
		if (serviceName) globalQuery.serviceName = serviceName
		if (searchTerm) globalQuery.$text = { $search: searchTerm }

		const paginationQuery: QueryFilter<Log> = {}
		if (lastId) paginationQuery._id = { $lt: new Types.ObjectId(lastId) }

		const result = await this.logModel
			.aggregate<iAggregateResult>([
				{ $match: globalQuery },
				{
					$facet: {
						data: [
							{ $match: paginationQuery },
							{ $sort: { _id: -1 } },
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
				nextCursor:
					facetResult.data.length > 0
						? facetResult.data[facetResult.data.length - 1]._id.toString()
						: undefined,
				limit
			}
		}
	}
}
