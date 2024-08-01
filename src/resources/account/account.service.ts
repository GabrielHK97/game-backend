import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceData } from 'src/utils/classes/service-data.class';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import * as bcrypt from 'bcrypt';
import { AccountDetailsDto } from './dto/account-dateils.dto';
import { AccountConverter } from './converter/account.converter';
import { SexEnum } from 'src/utils/enum/sex.enum';
import { Request } from 'express';
import { extractTokenFromHeader } from 'src/utils/functions/extract-token-from-header.function';
import { JwtService } from '@nestjs/jwt';

interface CanCreateAccountReturn {
  canCreate: boolean;
  error?: string;
}

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private readonly jwtService: JwtService
  ) {}

  async alreadyHasUsername(username: string): Promise<boolean> {
    return await this.accountRepository
      .findOneByOrFail({ username })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  isValidSex(sex: SexEnum): boolean {
    return [SexEnum.MALE, SexEnum.FEMALE, SexEnum.OTHER].includes(sex);
  }

  isValidEmail(email: string): boolean {
    return /@/.test(email) ? true : false;
  }

  hasAllFields(createAccountDto: CreateAccountDto): boolean {
    return createAccountDto.name &&
    createAccountDto.birthDate &&
    createAccountDto.sex &&
    createAccountDto.username &&
    createAccountDto.password &&
    createAccountDto.confirmPassword
      ? true
      : false;
  }

  async canCreateAccount(createAccountDto: CreateAccountDto): Promise<CanCreateAccountReturn> {
    if (!this.hasAllFields(createAccountDto)) {
      const response: CanCreateAccountReturn = {
        canCreate: false,
        error: 'Missing fields!'
      }
      return response;
    }

    if (await this.alreadyHasUsername(createAccountDto.username)) {
      const response: CanCreateAccountReturn = {
        canCreate: false,
        error: 'Account already exists!'
      }
      return response;
    }

    if (
      !this.passwordsMatch(
        createAccountDto.password,
        createAccountDto.confirmPassword,
      )
    ) {
      const response: CanCreateAccountReturn = {
        canCreate: false,
        error: 'Passwords do not match!'
      }
      return response;
    }

    if (!this.isValidEmail(createAccountDto.email)) {
      const response: CanCreateAccountReturn = {
        canCreate: false,
        error: 'Invalid email!'
      }
      return response;
    }

    if (!this.isValidSex(createAccountDto.sex)) {
      const response: CanCreateAccountReturn = {
        canCreate: false,
        error: 'Invalid sex!'
      }
      return response;
    }

    const response: CanCreateAccountReturn = {
      canCreate: true,
    }
    return response;
  }

  async create(createAccountDto: CreateAccountDto) {
    try {
      const {canCreate, error } = await this.canCreateAccount(createAccountDto);

      if (!canCreate) return new ServiceData(HttpStatus.BAD_REQUEST, error);

      bcrypt.hash(createAccountDto.password, 10, async (err, hash) => {
        createAccountDto.password = hash;
        const user = this.accountRepository.create(createAccountDto);
        await this.accountRepository.save(user);
      });

      return new ServiceData<void>(HttpStatus.OK, 'Account created!');
    } catch (error) {
      return new ServiceData<void>(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async getAccount(req: Request) {
    try {
      const token = extractTokenFromHeader(req.headers.cookie);
      const payload = this.jwtService.verify(token);
      const userId = payload.id;
      const account = await this.accountRepository.findOneBy({ id: userId });
      return new ServiceData<AccountDetailsDto>(
        HttpStatus.OK,
        'Account found!',
        AccountConverter.accountToAccountDetailsDto(account),
      );
    } catch (error) {
      return new ServiceData<void>(
        HttpStatus.BAD_REQUEST,
        'Account not found!',
      );
    }
  }
}
