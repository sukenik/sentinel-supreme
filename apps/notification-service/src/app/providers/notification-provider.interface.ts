import { SendNotificationDto } from '@sentinel-supreme/shared/server'

export interface iNotificationProvider {
	send(data: SendNotificationDto): Promise<void>
}
