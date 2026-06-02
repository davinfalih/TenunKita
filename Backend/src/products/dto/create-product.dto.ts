import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Kain Tenun Ikat NTT', description: 'Nama produk' })
  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example:
      'Kain tenun tradisional dari Nusa Tenggara Timur dengan motif khas',
    description: 'Deskripsi produk',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 250000,
    description: 'Harga produk dalam rupiah',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 50, description: 'Jumlah stok tersedia', minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty({ example: 1, description: 'ID kategori produk' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  categoryId: number;
}
