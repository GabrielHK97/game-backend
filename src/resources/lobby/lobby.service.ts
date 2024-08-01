import { HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { ServiceData } from 'src/utils/classes/service-data.class';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';

export interface Lobby {
  id: string;
  name: string;
  accountIds: string[];
  hostAccountId: string;
  numberOfPlayers: string;
}

@Injectable()
export class LobbyService {

  constructor(private readonly redisService: RedisService) {}

  async join(joinLobbyDto: JoinLobbyDto): Promise<Lobby> {
    const lobby: Lobby = await this.redisService.get(
      `lobby:${joinLobbyDto.id}`,
    );
    if (lobby) {
      lobby.accountIds.push(joinLobbyDto.accountId);
      lobby.numberOfPlayers = `2/2`;
      await this.redisService.set(`lobby:${joinLobbyDto.id}`, lobby);
    }
    return lobby;
  }

  async create(createLobbyDto: CreateLobbyDto): Promise<Lobby> {
    const newLobby: Lobby = {
      id: Date.now().toString(),
      name: createLobbyDto.name,
      accountIds: [createLobbyDto.hostAccountId],
      hostAccountId: createLobbyDto.hostAccountId,
      numberOfPlayers: '1/2',
    };
    await this.redisService.set(`lobby:${newLobby.id}`, newLobby);
    return newLobby;
  }

  async getLobbies(): Promise<Lobby[]> {
    const keys = await this.redisService.keys('lobby:*');
    const lobbies = await Promise.all(
      keys.map((key) => this.redisService.get(key)),
    );
    return lobbies;
  }
}
