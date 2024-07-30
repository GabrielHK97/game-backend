import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Request, Response } from 'express';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('')
  async create(@Body() createAccountDto: CreateAccountDto, @Res() res: Response) {
    const response = await this.accountService.create(createAccountDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @Get()
  async findUser(@Req() req: Request, @Res() res: Response) {
    const response = await this.accountService.findUser(req);
    return res.status(response.status).send(response.getMetadata());

  }
}
