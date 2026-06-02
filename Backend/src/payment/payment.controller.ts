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
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('upload-proof/:orderId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload bukti pembayaran untuk pesanan' })
  @ApiParam({ name: 'orderId', description: 'ID pesanan', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'File bukti pembayaran (gambar)' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Bukti pembayaran berhasil diupload' })
  @ApiResponse({ status: 400, description: 'File tidak ditemukan' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
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
  @ApiOperation({ summary: 'Lihat bukti pembayaran berdasarkan ID pesanan' })
  @ApiParam({ name: 'orderId', description: 'ID pesanan', example: 1 })
  @ApiResponse({ status: 200, description: 'Bukti pembayaran ditemukan' })
  @ApiResponse({ status: 404, description: 'Bukti pembayaran tidak ditemukan' })
  async getPaymentProof(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.getPaymentProof(orderId);
  }

  @Get('bill/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lihat tagihan/bill berdasarkan ID pesanan' })
  @ApiParam({ name: 'orderId', description: 'ID pesanan', example: 1 })
  @ApiResponse({ status: 200, description: 'Data tagihan ditemukan' })
  @ApiResponse({ status: 404, description: 'Pesanan tidak ditemukan' })
  async getBill(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.getBill(orderId);
  }

  @Patch('verify/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[ADMIN] Verifikasi pembayaran pesanan' })
  @ApiParam({ name: 'id', description: 'ID pembayaran', example: 1 })
  @ApiBody({ type: VerifyPaymentDto })
  @ApiResponse({ status: 200, description: 'Pembayaran berhasil diverifikasi' })
  @ApiResponse({ status: 403, description: 'Akses ditolak - bukan admin' })
  @ApiResponse({ status: 404, description: 'Pembayaran tidak ditemukan' })
  async verifyPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    return this.paymentService.verifyPayment(id, verifyPaymentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[ADMIN] Hapus pembayaran' })
  @ApiParam({ name: 'id', description: 'ID pembayaran', example: 1 })
  @ApiResponse({ status: 200, description: 'Pembayaran berhasil dihapus' })
  @ApiResponse({ status: 403, description: 'Akses ditolak - bukan admin' })
  @ApiResponse({ status: 404, description: 'Pembayaran tidak ditemukan' })
  async deletePayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.deletePayment(id);
  }
}
