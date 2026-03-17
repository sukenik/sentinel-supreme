import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import {
	appConfig,
	GATEWAY_DASHBOARD_NAMESPACE,
	iJwtPayload,
	iLog,
	WS_EVENTS
} from '@sentinel-supreme/shared'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
	cors: { origin: appConfig.DASHBOARD_URL },
	namespace: GATEWAY_DASHBOARD_NAMESPACE
})
export class DashboardStreamGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: Server

	private readonly logger = new Logger(DashboardStreamGateway.name)

	constructor(private readonly jwtService: JwtService) {}

	async handleConnection(client: Socket) {
		try {
			const token = client.handshake.auth?.token

			if (!token) {
				throw new Error('No token provided')
			}

			const payload = (await this.jwtService.verifyAsync(token)) as iJwtPayload

			client.data.user = payload

			this.logger.log(`Client authenticated: ${payload.email} (${client.id})`)
		} catch (error: any) {
			this.logger.error(`Connection denied: ${error.message}`)
			client.disconnect()
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`)
	}

	sendToClients(log: iLog) {
		this.server.emit(WS_EVENTS.LOG_RECEIVED, log)
	}
}
