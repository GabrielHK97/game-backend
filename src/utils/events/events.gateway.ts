import { JwtService } from '@nestjs/jwt';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { extractTokenFromHeader } from '../functions/extract-token-from-header.function';

@WebSocketGateway({
  cors: {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  activeSessions = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    const token = extractTokenFromHeader(client.handshake.headers.cookie);
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.id;

      if (this.activeSessions.has(userId)) {
        const previousSessionId = this.activeSessions.get(userId);
        this.server.sockets.sockets.get(previousSessionId)?.disconnect();
      }

      this.activeSessions.set(userId, client.id);

      console.log(`User ${userId} connected with session ${client.id}`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.activeSessions.forEach((sessionId, userId) => {
      if (sessionId === client.id) {
        this.activeSessions.delete(userId);
      }
    });

    console.log(`Client ${client.id} disconnected`);
  }
}
