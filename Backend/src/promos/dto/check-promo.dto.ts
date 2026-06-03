import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CheckPromoDto {
  @ApiProperty({ example: 'DISKON50', description: 'Kode promo yang akan dicek' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 100000, description: 'Subtotal belanja saat ini' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  subtotal: number;
}
