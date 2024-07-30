import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { ServiceData } from 'src/utils/classes/service-data.class';
import { extractTokenFromHeader } from 'src/utils/functions/extract-token-from-header.function';
import { Account } from 'src/resources/account/entities/account.entity';
import { IAuthenticationToken } from 'src/utils/interfaces/authentication-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private jwtService: JwtService,
  ) {}
  async login(authDto: AuthDto): Promise<ServiceData<IAuthenticationToken>> {
    try {
      const account = await this.accountRepository.findOneByOrFail({
        username: authDto.username,
      });
      if (await bcrypt.compare(authDto.password, account.password)) {
        return new ServiceData<IAuthenticationToken>(HttpStatus.OK, 'Logged in!', {
          token: this.jwtService.sign({
            id: account.id,
            username: account.username,
          }),
        });
      }
      return new ServiceData<IAuthenticationToken>(HttpStatus.BAD_REQUEST, 'Login failed!');
    } catch (error) {
      console.log(error);
      return new ServiceData<IAuthenticationToken>(HttpStatus.BAD_REQUEST, 'Login failed!');
    }
  }

  async authenticate(req: Request): Promise<ServiceData> {
    const token = extractTokenFromHeader(req.headers.cookie);
    return await this.jwtService
      .verifyAsync(token)
      .then(() => {
        return new ServiceData(HttpStatus.OK, 'Authenticated!');
      })
      .catch(() => {
        return new ServiceData(HttpStatus.UNAUTHORIZED, 'Could not authenticate!');
      });
  }
}
