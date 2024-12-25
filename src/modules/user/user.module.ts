import { Module } from '@nestjs/common';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { PrismaModule } from '../../db/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
