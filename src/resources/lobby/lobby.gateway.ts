import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LobbyService } from './lobby.service';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';

@WebSocketGateway()
export class LobbyGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly lobbyService: LobbyService) {}

  @SubscribeMessage('createLobby')
  async handleCreateLobby(
    @MessageBody() createLobbyDto: CreateLobbyDto,
  ): Promise<void> {
    const lobby = await this.lobbyService.create(createLobbyDto);
    this.server.emit('lobbyCreated', lobby);
    this.handleGetLobbies();
  }

  @SubscribeMessage('joinLobby')
  async handleJoinLobby(
    @MessageBody() JoinLobbyDto: JoinLobbyDto,
  ): Promise<void> {
    const lobby = await this.lobbyService.join(JoinLobbyDto);
    if (lobby.accountIds.length <= 2) this.server.emit('accountJoined', lobby);
    this.handleGetLobbies();
  }

  @SubscribeMessage('getLobbies')
  async handleGetLobbies(): Promise<void> {
    const lobbies = await this.lobbyService.getLobbies();
    this.server.emit('lobbies', lobbies);
  }
}
