import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsArray()
  customFields?: Array<{
    name: string;
    type: 'text' | 'number' | 'select' | 'multiselect' | 'range';
    required: boolean;
    options?: string[];
  }>;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
