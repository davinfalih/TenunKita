import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'])
  status: string;
}
