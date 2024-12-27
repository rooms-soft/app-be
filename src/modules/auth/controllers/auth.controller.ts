import { Body, Controller, Post, UseGuards, Request, Get, Inject } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import { LocalGuard } from '../../../security/guards/local-guard';
import { JwtGuard } from '../../../security/guards/jwt-guard';

@Controller('/auth')
export class AuthController {
  @Inject() private authService: AuthService;

  @Post('/register')
  register(@Body() body: AuthDto) {
    return this.authService.signUp(body);
  }

  @Post('/login')
  @UseGuards(LocalGuard)
  login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Get('/me')
  @UseGuards(JwtGuard)
  getMe(@Request() req: { user: User }) {
    return req.user;
  }
}
