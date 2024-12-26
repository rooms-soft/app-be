import { Test, TestingModule } from '@nestjs/testing';
import { ChatSignalingGateway } from './chat-signaling.gateway';

describe('ChatSingalingGateway', () => {
  let gateway: ChatSignalingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatSignalingGateway],
    }).compile();

    gateway = module.get<ChatSignalingGateway>(ChatSignalingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
