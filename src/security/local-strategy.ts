import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '@modules/auth/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject() private authService: AuthService;

  async validate(username: string, password: string): Promise<unknown> {
    return this.authService.validateUser(username, password);
  }
}
