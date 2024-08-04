import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { LobbyService } from "./lobby.service";
import { Response } from "express";
import { CreateLobbyDto } from "./dto/create-lobby.dto";
import { JoinLobbyDto } from "./dto/join-lobby.dto";

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Body() createLobbyDto: CreateLobbyDto, @Res() res: Response) {
    const response = await this.lobbyService.create(createLobbyDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Post('/join')
  async getAccount(@Body() joinLobbyDto: JoinLobbyDto, @Res() res: Response) {
    const response = await this.lobbyService.join(joinLobbyDto);
    return res.status(response.status).send(response.getMetadata());

  }
}