import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Response } from 'express';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto, @Res() res: Response) {
    const response = await this.accountService.create(createAccountDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = this.accountService.findOne(+id);
  }

  @Patch('/changepassword/:id')
  changePassword() {}

  //@Patch(':id')
  //update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
  //  return this.accountService.update(+id, updateAccountDto);
  //}
}
