import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) price?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) stock?: number;
  @IsOptional() @IsNumber() @Type(() => Number) categoryId?: number;
}
