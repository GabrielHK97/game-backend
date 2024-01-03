import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ServiceData } from 'src/classes/service_data.class';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Token } from 'src/interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { extractTokenFromHeader } from 'src/functions/extract_token_from_header.function';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private jwtService: JwtService,
  ) {}
  async login(authDto: AuthDto): Promise<ServiceData<Token | void>> {
    try {
      const account = await this.accountRepository.findOneByOrFail({
        username: authDto.username,
      });
      if (await bcrypt.compare(authDto.password, account.password)) {
        return new ServiceData<Token>(HttpStatus.OK, 'Logged in!', {
          token: await this.jwtService.signAsync({
            id: account.id,
            username: account.username,
          }),
        });
      }
    } catch (error) {
      console.log(error)
      return new ServiceData<void>(
        HttpStatus.BAD_REQUEST,
        'Could not login!',
      );
    }
  }

  async validate(req: Request): Promise<ServiceData<boolean>> {
    return await this.jwtService
      .verifyAsync(extractTokenFromHeader(req))
      .then(() => {
        return new ServiceData(HttpStatus.OK, 'Validated!', true);
      })
      .catch(() => {
        return new ServiceData(
          HttpStatus.BAD_REQUEST,
          'Could not validate!',
          false,
        );
      });
  }
}
