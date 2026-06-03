import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @ApiPropertyOptional({ example: 'DISKON50', description: 'Kode promo yang digunakan saat checkout' })
  @IsOptional()
  @IsString()
  promoCode?: string;
}
