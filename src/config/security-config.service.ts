import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SecurityConfigService {
  @Inject() private configService: ConfigService;

  get secret (): string {
    return this.configService.get<string>('security.secret');
  }
}
