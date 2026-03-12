import { Logger } from '@nestjs/common'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
	cors: { origin: '*' },
	namespace: 'logs'
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
		this.server.emit('log_received', log)
	}
}
