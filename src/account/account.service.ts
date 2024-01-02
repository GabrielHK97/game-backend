import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { ServiceData } from 'src/classes/service_data.class';
import { AccountDetailsDto } from './dto/account_details.dto';
import { AccountConverter } from './converter/account.converter';
import * as bcrypt from 'bcrypt';
import { PasswordChange } from 'src/classes/password_change.class';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<ServiceData<void>> {
    try {
      bcrypt.hash(createAccountDto.password, 10, async (err, hash) => {
        createAccountDto.password = hash;
        const date = new Date();
        createAccountDto.createdAt = date;
        createAccountDto.updatedAt = date;
        const account = this.accountRepository.create(createAccountDto);
        await this.accountRepository.save(account);
      });
      return new ServiceData<void>(HttpStatus.OK, 'Account created!');
    } catch (error) {
      return new ServiceData<void>(
        HttpStatus.BAD_REQUEST,
        'Could not create account!',
      );
    }
  }

  async findOne(id: number): Promise<ServiceData<AccountDetailsDto | void>> {
    try {
      const account = await this.accountRepository.findOneByOrFail({ id });
      const dto = AccountConverter.accountToAccountDetailsDto(account);
      return new ServiceData<AccountDetailsDto>(
        HttpStatus.OK,
        'Account found!',
        dto,
      );
    } catch (error) {
      return new ServiceData<void>(
        HttpStatus.BAD_REQUEST,
        'Could not find account!',
      );
    }
  }

  async updatePassword(
    id: number,
    passwordChange: PasswordChange,
  ): Promise<ServiceData<void>> {
    try {
      const account = await this.accountRepository.findOneByOrFail({
        id,
      });
      if (await bcrypt.compare(passwordChange.oldPassword, account.password)) {
        account.password = passwordChange.newPassword;
        await this.accountRepository.update(id, account);
      }
      return new ServiceData<void>(HttpStatus.OK, 'Password changed!');
    } catch (error) {
      return new ServiceData<void>(
        HttpStatus.BAD_REQUEST,
        'Could not change password!',
      );
    }
  }
}
