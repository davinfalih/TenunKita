import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Nama kategori tidak boleh kosong' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
