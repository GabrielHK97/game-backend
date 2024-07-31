import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LobbyService } from './lobby.service';

@WebSocketGateway()
export class LobbyGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly lobbyService: LobbyService) {}

    @SubscribeMessage('createLobby')
    async handleCreateLobby(@MessageBody() payload: { name: string }) {
        console.log(payload.name);
        const lobby = await this.lobbyService.createLobby(payload.name);
        const lobbies = await this.lobbyService.getLobbies();
        this.server.emit('lobbyCreated', lobby);
        this.server.emit('lobbiesList', lobbies);
    }

    @SubscribeMessage('joinLobby')
    async handleJoinLobby(@MessageBody() payload: { lobbyId: string, playerId: string }) {
        const lobby = await this.lobbyService.joinLobby(payload.lobbyId, payload.playerId);
        this.server.emit('playerJoined', lobby);
    }

    @SubscribeMessage('getLobbies')
    async handleGetLobbies() {
        const lobbies = await this.lobbyService.getLobbies();
        this.server.emit('lobbiesList', lobbies);
    }
}