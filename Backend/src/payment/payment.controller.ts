import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  BadRequestException,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('upload-proof/:orderId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPaymentProof(
    @Param('orderId', ParseIntPipe) orderId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    return this.paymentService.uploadPaymentProof(orderId, file);
  }

  @Get('proof/:orderId')
  @UseGuards(JwtAuthGuard)
  async getPaymentProof(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.getPaymentProof(orderId);
  }

  @Get('bill/:orderId')
  @UseGuards(JwtAuthGuard)
  async getBill(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.getBill(orderId);
  }

  @Patch('verify/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async verifyPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    return this.paymentService.verifyPayment(id, verifyPaymentDto);
  }
}
