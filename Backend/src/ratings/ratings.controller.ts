import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buat rating/ulasan untuk produk yang sudah dibeli',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'number', example: 1 },
        rating: { type: 'number', example: 5, minimum: 1, maximum: 5 },
        comment: {
          type: 'string',
          example: 'Produk sangat bagus dan berkualitas!',
        },
      },
      required: ['productId', 'rating'],
    },
  })
  @ApiResponse({ status: 201, description: 'Rating berhasil dibuat' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  create(@Request() req, @Body() data: any) {
    return this.ratingsService.create(req.user.sub, data);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Lihat semua rating untuk suatu produk (publik)' })
  @ApiParam({ name: 'productId', description: 'ID produk', example: 1 })
  @ApiResponse({ status: 200, description: 'Daftar rating berhasil diambil' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.ratingsService.findByProduct(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update rating yang sudah dibuat' })
  @ApiParam({ name: 'id', description: 'ID rating', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        score: { type: 'number', example: 4, minimum: 1, maximum: 5 },
        comment: { type: 'string', example: 'Produk cukup bagus' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Rating berhasil diupdate' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak ada izin untuk update' })
  @ApiResponse({ status: 404, description: 'Rating tidak ditemukan' })
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.ratingsService.update(id, req.user.sub, req.user.role, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus rating yang sudah dibuat' })
  @ApiParam({ name: 'id', description: 'ID rating', example: 1 })
  @ApiResponse({ status: 200, description: 'Rating berhasil dihapus' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak ada izin untuk menghapus' })
  @ApiResponse({ status: 404, description: 'Rating tidak ditemukan' })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.ratingsService.remove(id, req.user.sub, req.user.role);
  }
}
