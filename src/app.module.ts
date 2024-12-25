import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { ChatModule } from '@modules/chat/chat.module';
import { UserModule } from '@modules/user/user.module';
import { ConfigurationModule } from './config/config.module';
import { AppService } from './app.service';
import { PrismaService } from './db/prisma/services/prisma.service';
import { PrismaModule } from './db/prisma/prisma.module';
import Config from './config/config';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    UserModule,
    ConfigurationModule.forRoot({
      isGlobal: true,
      envFilePath: [process.env.NODE_ENV, '.env'],
      load: [Config],
    }),
    PrismaModule,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
