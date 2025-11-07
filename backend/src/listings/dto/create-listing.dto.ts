import { IsString, IsNumber, IsOptional, IsDateString, IsJSON } from 'class-validator';

export class CreateListingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  categoryId: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  pricePerUnit?: string;

  @IsString()
  region: string;

  @IsString()
  city: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsJSON()
  @IsOptional()
  customData?: Record<string, any>;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
