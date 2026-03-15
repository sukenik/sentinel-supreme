import { Logger } from '@nestjs/common'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { appConfig, GATEWAY_DASHBOARD_NAMESPACE, WS_EVENTS } from '@sentinel-supreme/shared'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
	cors: { origin: appConfig.DASHBOARD_URL },
	namespace: GATEWAY_DASHBOARD_NAMESPACE
})
export class LogsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: Server

	private readonly logger = new Logger(LogsGateway.name)

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`)
	}

	sendToClients(log: any) {
		this.server.emit(WS_EVENTS.LOG_RECEIVED, log)
	}
}
