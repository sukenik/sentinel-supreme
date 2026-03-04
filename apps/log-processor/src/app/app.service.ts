import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_VARS, QUEUES } from '@sentinel-supreme/shared'
import * as amqp from 'amqplib'
import {
	DL_ROUTING_KEY,
	DL_ROUTING_KEY_HEADER,
	DLQ_NAME,
	DLX_EXCHANGE,
	DLX_HEADER
} from '../consts'

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger = new Logger(AppService.name)

	constructor(private readonly configService: ConfigService) {}

	async onModuleInit() {
		await this.setupRabbitMQ()
	}

	private async setupRabbitMQ() {
		try {
			const rmqUrl = this.configService.getOrThrow<string>(ENV_VARS.RABBITMQ_URL)
			const connection = await amqp.connect(rmqUrl)
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

			this.logger.log('✅ RabbitMQ Topology (Exchanges/Queues) verified and created.')

			await channel.close()
			await connection.close()
		} catch (error) {
			this.logger.error('❌ Failed to setup RabbitMQ topology', error)
		}
	}
}
