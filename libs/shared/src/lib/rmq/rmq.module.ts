import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices'
import { ENV_VARS } from '../consts'
import { AmqplibQueueOptions } from '@nestjs/microservices/external/rmq-url.interface'

@Module({})
export class SharedRmqModule {
	static register(
		serviceName: string,
		queueName: string,
		noAck = true,
		queueOptions?: AmqplibQueueOptions
	): DynamicModule {
		return {
			module: SharedRmqModule,
			imports: [
				ClientsModule.registerAsync([
					{
						name: serviceName,
						inject: [ConfigService],
						useFactory: (config: ConfigService) => ({
							...this.getOptions(config, queueName, noAck, queueOptions)
						})
					}
				])
			],
			exports: [ClientsModule]
		}
	}

	static getOptions(
		config: ConfigService,
		queueName: string,
		noAck = true,
		queueOptions?: AmqplibQueueOptions
	): RmqOptions {
		return {
			transport: Transport.RMQ,
			options: {
				urls: [this.getUrl(config)],
				queue: queueName,
				noAck,
				queueOptions: {
					durable: true,
					...queueOptions
				}
			}
		}
	}

	static getOptionsRaw(
		queueName: string,
		noAck = true,
		queueOptions?: AmqplibQueueOptions
	): RmqOptions {
		return {
			transport: Transport.RMQ,
			options: {
				urls: [this.getUrlFromEnv()],
				queue: queueName,
				noAck,
				queueOptions: {
					durable: true,
					...queueOptions
				}
			}
		}
	}

	static getUrl(config: ConfigService): string {
		return `amqp://${config.get(ENV_VARS.RMQ_USER)}:${config.get(ENV_VARS.RMQ_PASSWORD)}@${config.get(ENV_VARS.RMQ_HOST)}:${config.get(ENV_VARS.RMQ_PORT)}/${config.get(ENV_VARS.RMQ_VHOST)}`
	}

	static getUrlFromEnv(): string {
		const user = process.env[ENV_VARS.RMQ_USER]
		const pass = process.env[ENV_VARS.RMQ_PASSWORD]
		const host = process.env[ENV_VARS.RMQ_HOST]
		const port = process.env[ENV_VARS.RMQ_PORT]
		const vhost = process.env[ENV_VARS.RMQ_VHOST]

		return `amqp://${user}:${pass}@${host}:${port}/${vhost}`
	}
}
