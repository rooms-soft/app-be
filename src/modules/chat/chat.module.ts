import { Module } from '@nestjs/common';
import { ChatRepository } from '@modules/chat/repositories/chat.repository';
import { PrismaModule } from '../../db/prisma/prisma.module';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { ChatSignalingGateway } from './gateways/chat-signaling.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, ChatSignalingGateway],
  exports: [ChatService, ChatRepository, ChatSignalingGateway],
})
export class ChatModule {}
