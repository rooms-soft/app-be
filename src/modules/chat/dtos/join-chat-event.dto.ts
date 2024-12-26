import { IsNotEmpty, IsString } from 'class-validator';

export class JoinChatEventDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  chatId: string;
}
