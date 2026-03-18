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
	WS_ERRORS,
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

	afterInit(server: Server) {
		server.use(async (socket, next) => {
			try {
				const token = socket.handshake.auth?.token

				if (!token) {
					return next(new Error(WS_ERRORS.NO_TOKEN_PROVIDED))
				}

				const payload = (await this.jwtService.verifyAsync(token)) as iJwtPayload
				socket.data.user = payload
				next()
			} catch (error: any) {
				next(new Error(error.message))
			}
		})
	}

	async handleConnection(client: Socket) {
		const user = client.data.user

		this.logger.log(`Client authenticated: ${user.email} (${client.id})`)
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`)
	}

	sendToClients(log: iLog) {
		this.server.emit(WS_EVENTS.LOG_RECEIVED, log)
	}
}
