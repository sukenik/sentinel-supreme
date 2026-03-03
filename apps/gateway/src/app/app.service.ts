import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { LOG_SERVICE } from '@sentinel-supreme/shared'

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger = new Logger('Gateway_Service')

	constructor(@Inject(LOG_SERVICE) private readonly client: ClientProxy) {}

	async onModuleInit() {
		try {
			await this.client.connect()
			this.logger.log('✅ Successfully connected to RabbitMQ from Gateway')
		} catch (error) {
			this.logger.error('❌ Failed to connect to RabbitMQ from Gateway', error)
		}
	}

	getData(): { message: string } {
		return { message: 'Hello API' }
	}
}
