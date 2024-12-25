import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityConfigService } from './security-config.service';

@Module({
  providers: [SecurityConfigService],
  exports: [SecurityConfigService],
})
export class ConfigurationModule extends ConfigModule {}
