import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }

  async uploadImage(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'ecommerce_products' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });
  }

  async create(dto: CreateProductDto, file?: any) {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.uploadImage(file);
    }
    return this.prisma.product.create({
      data: {
        ...dto,
        price: Number(dto.price),
        stock: Number(dto.stock),
        imageUrl,
      },
      include: { category: true },
    });
  }

  findAll(search?: string, categoryId?: string) {
    const categoryNumber = categoryId ? Number(categoryId) : undefined;
    return this.prisma.product.findMany({
      where: {
        ...(search && { name: { contains: search } }),
        ...(categoryNumber && { categoryId: categoryNumber }),
      },
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string | number) {
    const productId = Number(id);
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    return product;
  }

  async update(id: string | number, dto: UpdateProductDto, file?: any) {
    const productId = Number(id);
    await this.findOne(productId);
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.uploadImage(file);
    }
    return this.prisma.product.update({
      where: { id: productId },
      data: { ...dto, ...(imageUrl && { imageUrl }) },
      include: { category: true },
    });
  }

  async remove(id: string | number) {
    const productId = Number(id);
    await this.findOne(productId);
    await this.prisma.product.delete({ where: { id: productId } });
    return { message: 'Produk berhasil dihapus' };
  }
}
