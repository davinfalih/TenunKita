import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PromosService } from './promos.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { CheckPromoDto } from './dto/check-promo.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('promos')
@Controller('promos')
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Tambah kode promo baru' })
  @ApiBody({ type: CreatePromoDto })
  @ApiResponse({ status: 201, description: 'Kode promo berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Kode promo sudah terdaftar' })
  @ApiResponse({ status: 403, description: 'Akses ditolak - bukan admin' })
  create(@Body() dto: CreatePromoDto) {
    return this.promosService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Lihat semua kode promo' })
  @ApiResponse({ status: 200, description: 'Daftar semua promo berhasil diambil' })
  @ApiResponse({ status: 403, description: 'Akses ditolak - bukan admin' })
  findAll() {
    return this.promosService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Lihat detail kode promo berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID promo', example: '1' })
  @ApiResponse({ status: 200, description: 'Detail promo ditemukan' })
  @ApiResponse({ status: 404, description: 'Promo tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.promosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Update kode promo berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID promo', example: '1' })
  @ApiBody({ type: UpdatePromoDto })
  @ApiResponse({ status: 200, description: 'Kode promo berhasil diupdate' })
  @ApiResponse({ status: 404, description: 'Promo tidak ditemukan' })
  update(@Param('id') id: string, @Body() dto: UpdatePromoDto) {
    return this.promosService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Hapus kode promo berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID promo', example: '1' })
  @ApiResponse({ status: 200, description: 'Kode promo berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Promo tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.promosService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BUYER')
  @Post('check')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cek validitas kode promo dan hitung potongan harga' })
  @ApiBody({ type: CheckPromoDto })
  @ApiResponse({ status: 200, description: 'Kode promo valid dan kalkulasi dikembalikan' })
  @ApiResponse({ status: 400, description: 'Kode promo tidak aktif, kadaluarsa, kuota habis, atau minimal belanja kurang' })
  @ApiResponse({ status: 404, description: 'Kode promo tidak ditemukan' })
  checkPromo(@Body() dto: CheckPromoDto) {
    return this.promosService.checkPromo(dto);
  }
}
