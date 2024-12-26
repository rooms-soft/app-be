import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SdpEventTypeEnum } from '@modules/chat/enums/sdp-event-type.enum';

export class SdpEventDto {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @IsNotEmpty()
  @IsString()
  sdp: string;

  @IsNotEmpty()
  @IsEnum(SdpEventTypeEnum)
  type: SdpEventTypeEnum;
}
