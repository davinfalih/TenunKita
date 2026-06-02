import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    if (!data.productId) throw new BadRequestException('productId is required');

    const score = data.rating != null ? data.rating : data.score;
    if (score == null)
      throw new BadRequestException('rating or score is required');
    if (score < 1 || score > 5)
      throw new BadRequestException('rating must be between 1 and 5');

    const product = await this.prisma.product.findUnique({
      where: { id: Number(data.productId) },
    });
    if (!product)
      throw new NotFoundException(
        `Product with id ${data.productId} not found`,
      );

    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const existingRating = await this.prisma.rating.findFirst({
      where: { productId: Number(data.productId), userId: Number(userId) },
    });
    if (existingRating)
      throw new ConflictException(
        `User with id ${userId} has already rated this product`,
      );

    const rating = await this.prisma.rating.create({
      data: {
        score: Number(score),
        comment: data.comment || null,
        productId: Number(data.productId),
        userId: Number(userId),
      },
    });

    const agg = await this.prisma.rating.aggregate({
      where: { productId: Number(data.productId) },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.product.update({
      where: { id: Number(data.productId) },
      data: {
        averageRating: agg._avg.score || 0,
        totalReviews: agg._count.score || 0,
      },
    });

    return rating;
  }

  async findByProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: Number(productId) },
    });
    if (!product)
      throw new NotFoundException(`Product with id ${productId} not found`);

    return await this.prisma.rating.findMany({
      where: { productId: Number(productId) },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async update(id: number, userId: number, userRole: string, data: any) {
    const rating = await this.prisma.rating.findUnique({
      where: { id: Number(id) },
    });
    if (!rating) throw new NotFoundException(`Rating with id ${id} not found`);

    if (rating.userId !== Number(userId) && userRole !== 'ADMIN') {
      throw new BadRequestException(
        'You do not have permission to update this rating',
      );
    }

    const newScore = data.rating != null ? data.rating : data.score;

    if (newScore != null && (newScore < 1 || newScore > 5)) {
      throw new BadRequestException('rating must be between 1 and 5');
    }

    const updatedRating = await this.prisma.rating.update({
      where: { id: Number(id) },
      data: {
        score: newScore != null ? Number(newScore) : undefined,
        comment: data.comment !== undefined ? data.comment : undefined,
      },
    });

    // Recalculate average rating
    const agg = await this.prisma.rating.aggregate({
      where: { productId: rating.productId },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.product.update({
      where: { id: rating.productId },
      data: {
        averageRating: agg._avg.score || 0,
        totalReviews: agg._count.score || 0,
      },
    });

    return updatedRating;
  }

  async remove(id: number, userId: number, userRole: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id: Number(id) },
    });
    if (!rating) throw new NotFoundException(`Rating with id ${id} not found`);

    if (rating.userId !== Number(userId) && userRole !== 'ADMIN') {
      throw new BadRequestException(
        'You do not have permission to delete this rating',
      );
    }

    await this.prisma.rating.delete({ where: { id: Number(id) } });

    // Recalculate average rating
    const agg = await this.prisma.rating.aggregate({
      where: { productId: rating.productId },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.product.update({
      where: { id: rating.productId },
      data: {
        averageRating: agg._avg.score || 0,
        totalReviews: agg._count.score || 0,
      },
    });

    return { message: 'Rating berhasil dihapus' };
  }
}
