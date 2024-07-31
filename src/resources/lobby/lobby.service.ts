import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

export interface Lobby {
    id: string;
    name: string;
    players: string[];
    numberOfPlayers: string;
}

@Injectable()
export class LobbyService {
    constructor(private readonly redisService: RedisService) {}

    async createLobby(name: string): Promise<Lobby> {
        const newLobby: Lobby = { id: Date.now().toString(), name, players: [], numberOfPlayers: '0/2' };
        await this.redisService.set(`lobby:${newLobby.id}`, newLobby);
        return newLobby;
    }

    async getLobbies(): Promise<Lobby[]> {
        const keys = await this.redisService.keys('lobby:*');
        const lobbies = await Promise.all(keys.map(key => this.redisService.get(key)));
        return lobbies;
    }

    async joinLobby(lobbyId: string, playerName: string): Promise<Lobby> {
        const lobby: Lobby = await this.redisService.get(`lobby:${lobbyId}`);
        if (lobby) {
            lobby.players.push(playerName);
            lobby.numberOfPlayers = `${lobby.players.length}/2`;
            await this.redisService.set(`lobby:${lobbyId}`, lobby);
        }
        return lobby;
    }
}