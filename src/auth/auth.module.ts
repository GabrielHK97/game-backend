import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Account } from 'src/account/entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv'

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({
      global: true,
      secret:process.env.JWT_SECRET,
      // signOptions: {
      //     expiresIn: '3600s'
      // },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
