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
	GATEWAY_ROUTES,
	iAiChatChunk,
	iAlert,
	iAlertUpdate,
	iJwtPayload,
	iLog,
	WS_ERRORS,
	WS_EVENTS
} from '@sentinel-supreme/shared'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
	cors: { origin: appConfig.DASHBOARD_URL },
	namespace: GATEWAY_ROUTES.WS_DASHBOARD_STREAM
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
			} catch (error) {
				const { message } = error as { message: string }
				next(new Error(message))
			}
		})
	}

	async handleConnection(client: Socket) {
		const user = client.data.user as iJwtPayload

		await client.join(user.sub)

		this.logger.log(
			`Client authenticated: ${user.email} (${client.id}) and joined room: ${user.sub}`
		)
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`)
	}

	emitNewLog(log: iLog) {
		this.server.emit(WS_EVENTS.LOG_RECEIVED, log)
	}

	emitNewAlert(alert: iAlert) {
		this.server.emit(WS_EVENTS.ALERT_RECEIVED, alert)
	}

	emitAlertUpdate(update: iAlertUpdate) {
		this.server.emit(WS_EVENTS.AI_ANALYSIS_RECEIVED, update)
	}

	emitAiChunk(data: iAiChatChunk) {
		this.server.to(data.userId).emit(WS_EVENTS.AI_CHAT_CHUNK_RECEIVED, {
			content: data.content,
			isFinal: data.isFinal,
			hasUsedTools: data.hasUsedTools,
			tokensUsed: data.tokensUsed
		} as Partial<iAiChatChunk>)
	}

	emitAiError(data: { userId: string; error: string }) {
		this.server.to(data.userId).emit(WS_EVENTS.AI_CHAT_ERROR_RECEIVED, {
			error: data.error
		})
	}
}
