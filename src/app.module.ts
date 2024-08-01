import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './resources/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv'
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './utils/events/events.module';
import { Account } from './resources/account/entities/account.entity';
import { LobbyModule } from './resources/lobby/lobby.module';
import { RedisModule } from './redis/redis.module';
  
dotenv.config();

@Module({
  imports: [
    EventsModule,
    AuthModule,
    AccountModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      entities: [Account],
      synchronize: true,
    }),
    RedisModule,
    LobbyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
