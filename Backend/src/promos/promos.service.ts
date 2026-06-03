import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { CheckPromoDto } from './dto/check-promo.dto';
import { PromoType } from '@prisma/client';

@Injectable()
export class PromosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePromoDto) {
    const existing = await this.prisma.promo.findUnique({
      where: { code: dto.code.toUpperCase() },
    });
    if (existing) {
      throw new BadRequestException('Kode promo sudah terdaftar');
    }

    const { startDate, endDate, ...rest } = dto;

    return this.prisma.promo.create({
      data: {
        ...rest,
        code: dto.code.toUpperCase(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
  }

  findAll() {
    return this.prisma.promo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number | string) {
    const promoId = Number(id);
    const promo = await this.prisma.promo.findUnique({
      where: { id: promoId },
    });
    if (!promo) {
      throw new NotFoundException('Promo tidak ditemukan');
    }
    return promo;
  }

  async update(id: number | string, dto: UpdatePromoDto) {
    const promoId = Number(id);
    await this.findOne(promoId);

    if (dto.code) {
      const existing = await this.prisma.promo.findFirst({
        where: {
          code: dto.code.toUpperCase(),
          id: { not: promoId },
        },
      });
      if (existing) {
        throw new BadRequestException('Kode promo sudah terdaftar');
      }
    }

    const data: any = { ...dto };
    if (dto.code) data.code = dto.code.toUpperCase();
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    return this.prisma.promo.update({
      where: { id: promoId },
      data,
    });
  }

  async remove(id: number | string) {
    const promoId = Number(id);
    await this.findOne(promoId);
    await this.prisma.promo.delete({
      where: { id: promoId },
    });
    return { message: 'Promo berhasil dihapus' };
  }

  async validatePromo(code: string, subtotal: number) {
    const promo = await this.prisma.promo.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      throw new NotFoundException('Kode promo tidak valid atau tidak ditemukan');
    }

    if (!promo.isActive) {
      throw new BadRequestException('Kode promo sudah tidak aktif');
    }

    const now = new Date();
    if (now < new Date(promo.startDate)) {
      throw new BadRequestException('Masa berlaku kode promo belum dimulai');
    }

    if (now > new Date(promo.endDate)) {
      throw new BadRequestException('Kode promo sudah kadaluarsa');
    }

    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
      throw new BadRequestException('Kuota penggunaan kode promo sudah habis');
    }

    if (subtotal < promo.minOrderAmount) {
      throw new BadRequestException(
        `Minimal pembelanjaan untuk menggunakan promo ini adalah Rp ${promo.minOrderAmount.toLocaleString('id-ID')}`,
      );
    }

    let discountAmount = 0;
    if (promo.type === PromoType.PERCENTAGE) {
      discountAmount = subtotal * (promo.value / 100);
      if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
        discountAmount = promo.maxDiscount;
      }
    } else if (promo.type === PromoType.FIXED) {
      discountAmount = promo.value;
    }

    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return {
      promo,
      discountAmount,
    };
  }

  async checkPromo(dto: CheckPromoDto) {
    const { discountAmount, promo } = await this.validatePromo(dto.code, dto.subtotal);
    return {
      valid: true,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      discountAmount,
      finalAmount: dto.subtotal - discountAmount,
    };
  }
}
