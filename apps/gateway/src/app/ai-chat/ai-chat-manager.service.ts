import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { timeout } from 'rxjs/operators'
import { AI_CLIENT } from '../consts'

@Injectable()
export class AiManagerService {
	private readonly logger = new Logger(AiManagerService.name)

	constructor(@Inject(AI_CLIENT) private readonly aiClient: ClientProxy) {}

	async getAiResponse(message: string) {
		try {
			return await firstValueFrom(
				this.aiClient
					// TODO: const & change time (when we move to chunks)
					.send({ cmd: 'chat_command' }, { prompt: message })
					.pipe(timeout(35000))
			)
		} catch (error) {
			const { message } = error as { message: string }
			this.logger.error(`Failed to get response from AI Service: ${message}`)
			throw error
		}
	}
}
