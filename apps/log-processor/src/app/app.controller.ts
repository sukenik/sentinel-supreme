import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { LOG_PATTERNS } from '@sentinel-supreme/shared'

@Controller()
export class AppController {
	@MessagePattern(LOG_PATTERNS.NEW_LOG)
	handleLogMessage(@Payload() data: any, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()

		try {
			console.log('--- New Log Received ---')
			console.log(data)

			if (data.message?.includes('fail')) {
				throw new Error('Simulated failure')
			}

			channel.ack(originalMsg)
		} catch (error) {
			console.error('Processing failed, sending to DLX...')
			console.error('Error:', error)

			channel.nack(originalMsg, false, false)
		}
	}
}
