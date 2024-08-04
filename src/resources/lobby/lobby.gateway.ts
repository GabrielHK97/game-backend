import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LobbyService } from './lobby.service';
import { LeaveLobbyDto } from './dto/leave-lobby.dto';
import { DeleteLobbyDto } from './dto/delete-lobby.dto';
import { GetLobbyDto } from './dto/get-lobby.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';

@WebSocketGateway()
export class LobbyGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly lobbyService: LobbyService) {}

  @SubscribeMessage('getLobbies')
  async handleGetLobbies(): Promise<void> {
    const lobbies = await this.lobbyService.getLobbies();
    this.server.emit('gotLobbies', lobbies);
  }

  @SubscribeMessage('joinLobby')
  async handleJoinLobby(
    @MessageBody() joinLobbyDto: JoinLobbyDto,
  ): Promise<void> {
    const getLobbyDto: GetLobbyDto = {
      id: joinLobbyDto.id,
    };
    const lobby = await this.lobbyService.get(getLobbyDto);
    this.server.emit(`joinedLobby:${lobby.id}`, lobby);
    this.handleGetLobbies();
  }

  @SubscribeMessage('leaveLobby')
  async handleLeaveLobby(
    @MessageBody() leaveLobbyDto: LeaveLobbyDto,
  ): Promise<void> {
    const lobby = await this.lobbyService.leave(leaveLobbyDto);
    this.server.emit(`leftLobby:${lobby.id}`, lobby);
    this.handleGetLobbies();
  }

  @SubscribeMessage('deleteLobby')
  async handleDeleteLobby(
    @MessageBody() deleteLobbyDto: DeleteLobbyDto,
  ): Promise<void> {
    const lobby = await this.lobbyService.delete(deleteLobbyDto);
    this.server.emit(`deletedLobby:${lobby.id}`);
    this.handleGetLobbies();
  }
}
