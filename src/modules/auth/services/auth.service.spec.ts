import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dtos/auth.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: UserRepository;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockUserRepository = {
    find: jest.fn(),
    findManyWhere: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUser = {
    id: '1',
    username: 'testuser',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct credentials', async () => {
    mockUserRepository.find.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.validateUser('testuser', 'password');
    expect(result).toEqual({ id: '1', username: 'testuser', createdAt: mockUser.createdAt, updatedAt: mockUser.updatedAt });
  });

  it('should throw UnauthorizedException for incorrect password', async () => {
    mockUserRepository.find.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(service.validateUser('testuser', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for non-existing user', async () => {
    mockUserRepository.find.mockResolvedValue(null);

    await expect(service.validateUser('nonexistent', 'password')).rejects.toThrow(UnauthorizedException);
  });

  it('should login user and return token', async () => {
    mockJwtService.sign.mockReturnValue('token');

    const result = await service.login(mockUser);
    expect(result).toEqual({ token: 'token' });
  });

  it('should sign up a new user', async () => {
    mockUserRepository.findManyWhere.mockResolvedValue([]);
    mockUserRepository.create.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

    const dto: AuthDto = { username: 'newuser', password: 'password' };
    const result = await service.signUp(dto);
    expect(result).toEqual({ id: '1', username: 'testuser', createdAt: mockUser.createdAt, updatedAt: mockUser.updatedAt });
  });

  it('should throw ConflictException for existing username', async () => {
    mockUserRepository.findManyWhere.mockResolvedValue([mockUser]);

    const dto: AuthDto = { username: 'testuser', password: 'password' };
    await expect(service.signUp(dto)).rejects.toThrow(ConflictException);
  });

  it('should hash password correctly', async () => {
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

    const result = await service.hashPass('password');
    expect(result).toBe('hashedpassword');
  });
});
