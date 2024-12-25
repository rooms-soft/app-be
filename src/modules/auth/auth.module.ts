import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@modules/auth/controllers/auth.controller';
import { ConfigurationModule } from '../../config/config.module';
import { JwtGuard } from '../../security/guards/jwt-guard';
import { LocalStrategy } from '../../security/local-strategy';
import { JwtStrategy } from '../../security/jwt-strategy';
import { SecurityConfigService } from '../../config/security-config.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    UserModule,
    ConfigurationModule,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [SecurityConfigService],
      useFactory: (configService: SecurityConfigService) => ({
        secret: configService.secret,
        signOptions: {
          expiresIn: '2d',
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtGuard],
  controllers: [AuthController],
})
export class AuthModule {}
