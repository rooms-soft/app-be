import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@modules/user/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '@modules/auth/dtos/auth.dto';

@Injectable()
export class AuthService {
  @Inject() private userRepository: UserRepository;
  @Inject() private jwtService: JwtService;

  async validateUser(username: string, pass: string): Promise<unknown> {
    const user = await this.userRepository.find({ username });

    if (!user) {
      throw new UnauthorizedException('User with such credentials was not found');
    }

    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Incorrect password provided');
    }

    delete user.password;

    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, username: user.username, createdAt: Date.now() };
    return { token: this.jwtService.sign(payload) };
  }

  async signUp(data: AuthDto) {
    const users = await this.userRepository.findManyWhere({ username: data.username });

    if (users.length) {
      throw new ConflictException('User with such credentials already exist');
    }

    const newUser = await  this.userRepository.create({
      ...data,
      password: await this.hashPass(data.password),
    });

    delete newUser.password;

    return newUser;
  }

  async hashPass(password: string) {
    const saltRounds = 11;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }
}
