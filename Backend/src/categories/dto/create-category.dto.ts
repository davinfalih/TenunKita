import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Kain Tenun', description: 'Nama kategori produk' })
  @IsNotEmpty({ message: 'Nama kategori tidak boleh kosong' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Kategori untuk semua jenis kain tenun tradisional',
    description: 'Deskripsi kategori',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
