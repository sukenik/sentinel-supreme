import * as amqp from 'amqplib'
import { AI_ANALYSIS_DLX, DL_CONFIG, LOG_DLX, NOTIFICATIONS_DLX, QUEUES } from '../consts'

export async function validateRmqTopology(url: string) {
	const { DLX_HEADER, DL_ROUTING_KEY_HEADER } = DL_CONFIG

	const connection = await amqp.connect(url)
	const channel = await connection.createChannel()

	await channel.assertExchange(LOG_DLX.DLX_NAME, 'fanout', { durable: true })
	await channel.assertQueue(LOG_DLX.DLQ_NAME, { durable: true })
	await channel.bindQueue(LOG_DLX.DLQ_NAME, LOG_DLX.DLX_NAME, LOG_DLX.DL_ROUTING_KEY)

	await channel.assertExchange(NOTIFICATIONS_DLX.DLX_NAME, 'fanout', { durable: true })
	await channel.assertQueue(NOTIFICATIONS_DLX.DLQ_NAME, { durable: true })
	await channel.bindQueue(
		NOTIFICATIONS_DLX.DLQ_NAME,
		NOTIFICATIONS_DLX.DLX_NAME,
		NOTIFICATIONS_DLX.DL_ROUTING_KEY
	)

	await channel.assertExchange(AI_ANALYSIS_DLX.DLX_NAME, 'fanout', { durable: true })
	await channel.assertQueue(AI_ANALYSIS_DLX.DLQ_NAME, { durable: true })
	await channel.bindQueue(
		AI_ANALYSIS_DLX.DLQ_NAME,
		AI_ANALYSIS_DLX.DLX_NAME,
		AI_ANALYSIS_DLX.DL_ROUTING_KEY
	)

	await channel.assertQueue(QUEUES.LOGS, {
		durable: true,
		arguments: {
			[DLX_HEADER]: LOG_DLX.DLX_NAME,
			[DL_ROUTING_KEY_HEADER]: LOG_DLX.DL_ROUTING_KEY
		}
	})

	await channel.assertQueue(QUEUES.NOTIFICATIONS, {
		durable: true,
		arguments: {
			[DLX_HEADER]: NOTIFICATIONS_DLX.DLX_NAME,
			[DL_ROUTING_KEY_HEADER]: NOTIFICATIONS_DLX.DL_ROUTING_KEY
		}
	})

	await channel.assertQueue(QUEUES.AI_ANALYSIS, {
		durable: true,
		arguments: {
			[DLX_HEADER]: AI_ANALYSIS_DLX.DLX_NAME,
			[DL_ROUTING_KEY_HEADER]: AI_ANALYSIS_DLX.DL_ROUTING_KEY
		}
	})

	await channel.assertQueue(QUEUES.UI_UPDATES, {
		durable: true
	})

	await channel.close()
	await connection.close()
}
