import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsUUID()
  recipientId: string;

  @IsOptional()
  @IsUUID()
  listingId?: string;
}
