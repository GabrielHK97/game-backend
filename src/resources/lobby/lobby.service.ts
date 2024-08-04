import { HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { ServiceData } from 'src/utils/classes/service-data.class';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { DeleteLobbyDto } from './dto/delete-lobby.dto';
import { LeaveLobbyDto } from './dto/leave-lobby.dto';
import { GetLobbyDto } from './dto/get-lobby.dto';

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

  async join(joinLobbyDto: JoinLobbyDto): Promise<ServiceData<Lobby>> {
    const lobby: Lobby = await this.redisService.get(
      `lobby:${joinLobbyDto.id}`,
    );
    lobby.accountIds.push(joinLobbyDto.accountId);
    lobby.numberOfPlayers = `2/2`;
    await this.redisService.set(`lobby:${joinLobbyDto.id}`, lobby);
    return new ServiceData(HttpStatus.OK, 'Joined Lobby!', lobby);
  }

  async create(createLobbyDto: CreateLobbyDto): Promise<ServiceData<Lobby>> {
    const newLobby: Lobby = {
      id: Date.now().toString(),
      name: createLobbyDto.name,
      accountIds: [createLobbyDto.hostAccountId],
      hostAccountId: createLobbyDto.hostAccountId,
      numberOfPlayers: '1/2',
    };
    await this.redisService.set(`lobby:${newLobby.id}`, newLobby);
    return new ServiceData(HttpStatus.OK, 'Created Lobby!', newLobby);
  }

  async get(getLobbyDto: GetLobbyDto): Promise<Lobby> {
    const lobby: Lobby = await this.redisService.get(`lobby:${getLobbyDto.id}`);
    return lobby;
  }

  async delete(deleteLobbyDto: DeleteLobbyDto): Promise<Lobby> {
    const lobby = await this.redisService.get(`lobby:${deleteLobbyDto.id}`);
    if (lobby.hostAccountId === deleteLobbyDto.accountId) {
      await this.redisService.del(`lobby:${deleteLobbyDto.id}`);
      return lobby;
    }
  }

  async leave(leaveLobbyDto: LeaveLobbyDto): Promise<Lobby> {
    const lobby = await this.redisService.get(`lobby:${leaveLobbyDto.id}`);
    const newLobby: Lobby = {
      ...lobby,
      numberOfPlayers: '1/2',
      accountIds: lobby.accountIds.filter((accountId: string) => {
        return accountId !== leaveLobbyDto.accountId;
      }),
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
