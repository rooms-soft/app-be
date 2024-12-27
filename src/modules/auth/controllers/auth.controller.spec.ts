import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { from, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn((dto: AuthDto) => of({ id: '1', ...dto })),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login: jest.fn((user: User) => of({ accessToken: 'token' })),
  };

  const mockUser: User = {
    id: '1',
    username: 'testuser',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', (done) => {
      const dto: AuthDto = {
        username: 'testuser',
        password: 'password',
      };

      from(controller.register(dto)).subscribe((result) => {
        expect(result).toEqual({ id: '1', ...dto });
        done();
      });
    });
  });

  describe('login', () => {
    it('should login a user', (done) => {
      const req = { user: mockUser };

      from(controller.login(req)).subscribe((result) => {
        expect(result).toEqual({ accessToken: 'token' });
        done();
      });
    });
  });

  describe('getMe', () => {
    it('should return the current user', () => {
      const req = { user: mockUser };

      expect(controller.getMe(req)).toEqual(mockUser);
    });
  });
});
