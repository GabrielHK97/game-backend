import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LobbyService } from './lobby.service';

@WebSocketGateway()
export class LobbyGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly lobbyService: LobbyService) {}

    @SubscribeMessage('createLobby')
    async handleCreateLobby(payload: { name: string }) {
        const lobby = await this.lobbyService.createLobby(payload.name);
        const lobbies = await this.lobbyService.getLobbies();
        this.server.emit('lobbyCreated', lobby);
        this.server.emit('lobbiesList', lobbies);
    }

    @SubscribeMessage('joinLobby')
    async handleJoinLobby(payload: { lobbyId: string, playerName: string }) {
        const lobby = await this.lobbyService.joinLobby(payload.lobbyId, payload.playerName);
        this.server.emit('playerJoined', lobby);
    }

    @SubscribeMessage('getLobbies')
    async handleGetLobbies() {
        console.log('Getting lobbies');
        const lobbies = await this.lobbyService.getLobbies();
        this.server.emit('lobbiesList', lobbies);
    }
}