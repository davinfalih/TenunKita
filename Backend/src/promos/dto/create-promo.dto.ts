import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PromoType } from '@prisma/client';

export class CreatePromoDto {
  @ApiProperty({ example: 'DISKON50', description: 'Kode promo unik' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiPropertyOptional({ example: 'Diskon 50% hingga Rp 20.000', description: 'Deskripsi promo' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'PERCENTAGE', enum: ['PERCENTAGE', 'FIXED'], description: 'Tipe diskon' })
  @IsNotEmpty()
  @IsEnum(PromoType)
  type: PromoType;

  @ApiProperty({ example: 10, description: 'Nilai diskon (persen atau rupiah)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional({ example: 20000, description: 'Maksimal potongan harga untuk tipe persentase' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @ApiProperty({ example: 50000, description: 'Minimal pembelian untuk menggunakan promo' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minOrderAmount: number;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z', description: 'Tanggal mulai berlaku' })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({ example: '2026-06-30T23:59:59.000Z', description: 'Tanggal selesai berlaku' })
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @ApiPropertyOptional({ example: 100, description: 'Batas total penggunaan promo' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({ example: true, description: 'Status keaktifan promo' })
  @IsOptional()
  isActive?: boolean;
}
