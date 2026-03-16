import * as amqp from 'amqplib'
import { DL_CONFIG, QUEUES } from './consts'

export async function validateRmqTopology(url: string) {
	const { DLX_EXCHANGE, DLQ_NAME, DL_ROUTING_KEY, DLX_HEADER, DL_ROUTING_KEY_HEADER } = DL_CONFIG

	const connection = await amqp.connect(url)
	const channel = await connection.createChannel()

	await channel.assertExchange(DLX_EXCHANGE, 'fanout', { durable: true })
	await channel.assertQueue(DLQ_NAME, { durable: true })

	await channel.bindQueue(DLQ_NAME, DLX_EXCHANGE, DL_ROUTING_KEY)

	await channel.assertQueue(QUEUES.LOG_QUEUE, {
		durable: true,
		arguments: {
			[DLX_HEADER]: DLX_EXCHANGE,
			[DL_ROUTING_KEY_HEADER]: DL_ROUTING_KEY
		}
	})

	await channel.assertQueue(QUEUES.UI_UPDATES_QUEUE, {
		durable: true
	})

	await channel.close()
	await connection.close()
}
