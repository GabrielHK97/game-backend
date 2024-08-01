import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/create')
  async create(@Body() createAccountDto: CreateAccountDto, @Res() res: Response) {
    const response = await this.accountService.create(createAccountDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAccount(@Req() req: Request, @Res() res: Response) {
    const response = await this.accountService.getAccount(req);
    return res.status(response.status).send(response.getMetadata());

  }
}
