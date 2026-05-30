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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addToCart(userId, dto) {
        const userIdNumber = Number(userId);
        const productId = Number(dto.productId);
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Produk tidak ditemukan');
        if (product.stock < dto.quantity)
            throw new common_1.BadRequestException('Stok produk tidak mencukupi');
        const existing = await this.prisma.cartItem.findFirst({
            where: { userId: userIdNumber, productId },
        });
        if (existing) {
            return this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + dto.quantity },
                include: { product: true },
            });
        }
        return this.prisma.cartItem.create({
            data: { userId: userIdNumber, productId, quantity: dto.quantity },
            include: { product: true },
        });
    }
    async getCart(userId) {
        const userIdNumber = Number(userId);
        const items = await this.prisma.cartItem.findMany({
            where: { userId: userIdNumber },
            include: {
                product: { include: { category: { select: { name: true } } } },
            },
        });
        const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        return { items, subtotal };
    }
    async updateItem(userId, itemId, dto) {
        const userIdNumber = Number(userId);
        const itemIdNumber = Number(itemId);
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemIdNumber, userId: userIdNumber },
        });
        if (!item)
            throw new common_1.NotFoundException('Item keranjang tidak ditemukan');
        return this.prisma.cartItem.update({
            where: { id: itemIdNumber },
            data: { quantity: dto.quantity },
            include: { product: true },
        });
    }
    async removeItem(userId, itemId) {
        const userIdNumber = Number(userId);
        const itemIdNumber = Number(itemId);
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemIdNumber, userId: userIdNumber },
        });
        if (!item)
            throw new common_1.NotFoundException('Item keranjang tidak ditemukan');
        await this.prisma.cartItem.delete({ where: { id: itemIdNumber } });
        return { message: 'Item berhasil dihapus dari keranjang' };
    }
    async clearCart(userId) {
        const userIdNumber = Number(userId);
        await this.prisma.cartItem.deleteMany({ where: { userId: userIdNumber } });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map