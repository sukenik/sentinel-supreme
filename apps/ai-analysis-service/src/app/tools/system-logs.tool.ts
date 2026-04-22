import { DynamicStructuredTool } from '@langchain/core/tools'
import { Log } from '@sentinel-supreme/shared/server'
import { Model } from 'mongoose'
import { z } from 'zod'

export const createSystemHealthTool = (logModel: Model<Log>) =>
	new DynamicStructuredTool({
		name: 'get_system_stats',
		description: 'Calculates error rates and system health from logs.',
		schema: z.object({
			minutesBack: z
				.number()
				.default(10)
				.describe('The number of minutes to look back for logs')
		}),
		func: async ({ minutesBack }) => {
			const timeLimit = new Date(Date.now() - minutesBack * 60000)

			const stats = await logModel.aggregate([
				{ $match: { createdAt: { $gte: timeLimit } } },
				{
					$group: {
						_id: '$level',
						count: { $sum: 1 },
						services: { $addToSet: '$service' }
					}
				}
			])

			return JSON.stringify({
				message: `Found statistics for the last ${minutesBack} minutes`,
				data: stats,
				timestamp: new Date().toISOString()
			})
		}
	})
