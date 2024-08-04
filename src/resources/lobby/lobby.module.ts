import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyGateway } from './lobby.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { LobbyController } from './lobby.controller';

@Module({
    imports: [RedisModule],
    controllers: [LobbyController],
    providers: [LobbyService, LobbyGateway],
})
export class LobbyModule {}