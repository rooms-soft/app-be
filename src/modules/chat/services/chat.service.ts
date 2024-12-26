import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from '@modules/chat/repositories/chat.repository';
import { CreateChatDto } from '@modules/chat/dtos/create-chat.dto';
import { ChatSignalingGateway } from '@modules/chat/gateways/chat-signaling.gateway';

@Injectable()
export class ChatService {
  @Inject() private readonly chatRepository: ChatRepository;
  @Inject() private readonly chatSignalingGateway: ChatSignalingGateway;

  getAll(ownerId: string) {
    return this.chatRepository.getManyWhere({ ownerId });
  }

  create(chatData: CreateChatDto, ownerId: string) {
    return this.chatRepository.create({ ...chatData, ownerId });
  }
}
