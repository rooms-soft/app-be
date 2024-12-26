import { BadRequestException, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { ChatRepository } from '@modules/chat/repositories/chat.repository';

@Injectable()
export class ChatByIdPipe implements PipeTransform {
  @Inject() private readonly chatRepository: ChatRepository;

  async transform(chatId: string) {
    const chat = await this.chatRepository.findWhere({ id: chatId });

    if (!chat) {
      throw new BadRequestException('Chat with such id not found');
    }

    return chatId;
  }
}
