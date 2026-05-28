import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RegisterDto } from './register.dto';

export class RegisterAdminDto extends RegisterDto {
  @IsNotEmpty({ message: 'Admin secret tidak boleh kosong' })
  @IsString()
  declare adminSecret: string;
}
