import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../db/prisma/services/prisma.service';

@Injectable()
export class ChatRepository {
  @Inject() private readonly prismaService: PrismaService;

  getManyWhere(where: Prisma.ChatWhereInput) {
    return this.prismaService.chat.findMany({ where });
  }

  create(data: Prisma.ChatUncheckedCreateInput) {
    return this.prismaService.chat.create({ data });
  }

  findWhere(where: Prisma.ChatWhereInput) {
    return this.prismaService.chat.findFirst({ where });
  }


  createSession(data: Prisma.ChatSessionUncheckedCreateInput) {
    return this.prismaService.chatSession.create({ data });
  }

  dropSession(sessionId: string) {
    return this.prismaService.chatSession.delete({ where: { id: sessionId } });
  }
}
