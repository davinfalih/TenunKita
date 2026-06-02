import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Admin: Tambah produk + upload gambar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Tambah produk baru dengan gambar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Gambar produk',
        },
        name: { type: 'string', example: 'Kain Tenun Ikat' },
        description: {
          type: 'string',
          example: 'Kain tenun tradisional dari NTT',
        },
        price: { type: 'number', example: 250000 },
        stock: { type: 'number', example: 50 },
        categoryId: { type: 'string', example: '1' },
      },
      required: ['name', 'price', 'stock'],
    },
  })
  @ApiResponse({ status: 201, description: 'Produk berhasil dibuat' })
  @ApiResponse({ status: 403, description: 'Akses ditolak - bukan admin' })
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(dto, file);
  }

  // Publik: Lihat semua produk (bisa filter & search)
  @Get()
  @ApiOperation({
    summary: 'Lihat semua produk (publik, bisa filter & search)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Kata kunci pencarian nama produk',
    example: 'tenun',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter berdasarkan ID kategori',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Daftar produk berhasil diambil' })
  findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.productsService.findAll(search, categoryId);
  }

  // Publik: Lihat detail 1 produk
  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail produk berdasarkan ID (publik)' })
  @ApiParam({ name: 'id', description: 'ID produk', example: '1' })
  @ApiResponse({ status: 200, description: 'Detail produk ditemukan' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // Admin: Update produk + ganti gambar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Update produk beserta gambar' })
  @ApiParam({ name: 'id', description: 'ID produk', example: '1' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Gambar produk baru (opsional)',
        },
        name: { type: 'string', example: 'Kain Tenun Ikat' },
        description: { type: 'string', example: 'Deskripsi produk diperbarui' },
        price: { type: 'number', example: 300000 },
        stock: { type: 'number', example: 30 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Produk berhasil diupdate' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.update(id, dto, file);
  }

  // Admin: Hapus produk
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Hapus produk berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID produk', example: '1' })
  @ApiResponse({ status: 200, description: 'Produk berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
