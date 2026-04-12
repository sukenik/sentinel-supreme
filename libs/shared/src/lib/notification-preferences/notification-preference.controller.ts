import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common'
import { GATEWAY_ROUTES } from '../consts'
import { Roles } from '../decorators/roles.decorator'
import { NotificationPreferenceDto } from '../dto/notification-preference.dto'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { eUserRole } from '../types'
import { NotificationsPreferencesService } from './notification-preference.service'

@Controller(GATEWAY_ROUTES.NOTIFICATIONS)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(eUserRole.ADMIN)
export class NotificationsPreferencesController {
	constructor(private readonly service: NotificationsPreferencesService) {}

	@Get()
	getAll() {
		return this.service.getAll()
	}

	@Patch()
	update(@Body() dto: NotificationPreferenceDto) {
		return this.service.upsert(dto)
	}

	@Get(GATEWAY_ROUTES.GLOBAL_MUTE)
	async getMute(@Query('userEmail') userEmail: string) {
		const isMuted = await this.service.getGlobalMuteStatusByUser(userEmail)
		return { isMuted }
	}

	@Patch(GATEWAY_ROUTES.GLOBAL_MUTE)
	async setMute(@Body() body: { userEmail: string; isMuted: boolean }) {
		console.log(body)
		return await this.service.setGlobalMute(body.userEmail, body.isMuted)
	}
}
