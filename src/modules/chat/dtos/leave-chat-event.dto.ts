import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveChatEventDto {
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
