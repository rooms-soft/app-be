import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../db/prisma/services/prisma.service';

@Injectable()
export class UserRepository {
  @Inject() private prismaService: PrismaService;

  async findManyWhere(where: Prisma.UserWhereInput) {
    return this.prismaService.user.findMany({
      where,
    });
  }

  async find(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where,
    });
  }

  async create(data: Prisma.UserUncheckedCreateInput) {
    return this.prismaService.user.create({ data });
  }
}
