import { Controller, Get } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { LOG_PATTERNS } from '@sentinel-supreme/shared'
import { AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getData() {
		return this.appService.getData()
	}

	@MessagePattern(LOG_PATTERNS.NEW_LOG)
	handleLogMessage(@Payload() data: any) {
		console.log('--- New Log Received in Processor ---')
		console.log(data)
		return { status: 'processed' }
	}
}
