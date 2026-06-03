"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PromosService = class PromosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.promo.findUnique({
            where: { code: dto.code.toUpperCase() },
        });
        if (existing) {
            throw new common_1.BadRequestException('Kode promo sudah terdaftar');
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
    async findOne(id) {
        const promoId = Number(id);
        const promo = await this.prisma.promo.findUnique({
            where: { id: promoId },
        });
        if (!promo) {
            throw new common_1.NotFoundException('Promo tidak ditemukan');
        }
        return promo;
    }
    async update(id, dto) {
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
                throw new common_1.BadRequestException('Kode promo sudah terdaftar');
            }
        }
        const data = { ...dto };
        if (dto.code)
            data.code = dto.code.toUpperCase();
        if (dto.startDate)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate)
            data.endDate = new Date(dto.endDate);
        return this.prisma.promo.update({
            where: { id: promoId },
            data,
        });
    }
    async remove(id) {
        const promoId = Number(id);
        await this.findOne(promoId);
        await this.prisma.promo.delete({
            where: { id: promoId },
        });
        return { message: 'Promo berhasil dihapus' };
    }
    async validatePromo(code, subtotal) {
        const promo = await this.prisma.promo.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!promo) {
            throw new common_1.NotFoundException('Kode promo tidak valid atau tidak ditemukan');
        }
        if (!promo.isActive) {
            throw new common_1.BadRequestException('Kode promo sudah tidak aktif');
        }
        const now = new Date();
        if (now < new Date(promo.startDate)) {
            throw new common_1.BadRequestException('Masa berlaku kode promo belum dimulai');
        }
        if (now > new Date(promo.endDate)) {
            throw new common_1.BadRequestException('Kode promo sudah kadaluarsa');
        }
        if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
            throw new common_1.BadRequestException('Kuota penggunaan kode promo sudah habis');
        }
        if (subtotal < promo.minOrderAmount) {
            throw new common_1.BadRequestException(`Minimal pembelanjaan untuk menggunakan promo ini adalah Rp ${promo.minOrderAmount.toLocaleString('id-ID')}`);
        }
        let discountAmount = 0;
        if (promo.type === client_1.PromoType.PERCENTAGE) {
            discountAmount = subtotal * (promo.value / 100);
            if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
                discountAmount = promo.maxDiscount;
            }
        }
        else if (promo.type === client_1.PromoType.FIXED) {
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
    async checkPromo(dto) {
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
};
exports.PromosService = PromosService;
exports.PromosService = PromosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromosService);
//# sourceMappingURL=promos.service.js.map