import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from '@modules/chat/services/chat.service';
import { User } from '@prisma/client';
import { CreateChatDto } from '@modules/chat/dtos/create-chat.dto';
import { JwtGuard } from '../../../security/guards/jwt-guard';

@Controller('chat')
export class ChatController {
  @Inject() private readonly chatService: ChatService;

  @Get()
  @UseGuards(JwtGuard)
  getAll(@Req() { user: { id } }: { user: User }) {
    return this.chatService.getAll(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() body: CreateChatDto, @Req() { user: { id } }: { user: User }) {
    return this.chatService.create(body, id);
  }
}
