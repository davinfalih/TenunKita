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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cart_service_1 = require("../cart/cart.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    cartService;
    constructor(prisma, cartService) {
        this.prisma = prisma;
        this.cartService = cartService;
    }
    async checkout(userId) {
        const userIdNumber = Number(userId);
        const { items, subtotal } = await this.cartService.getCart(userIdNumber);
        if (items.length === 0) {
            throw new common_1.BadRequestException('Keranjang belanja kosong');
        }
        for (const item of items) {
            if (item.product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Stok produk "${item.product.name}" tidak mencukupi`);
            }
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userIdNumber },
        });
        const order = await this.prisma.order.create({
            data: {
                userId: userIdNumber,
                totalAmount: subtotal,
                status: client_1.OrderStatus.PENDING,
                orderItems: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
            include: { orderItems: { include: { product: true } } },
        });
        for (const item of items) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        await this.cartService.clearCart(userIdNumber);
        await this.prisma.payment.create({
            data: {
                orderId: order.id,
                userId: userIdNumber,
                amount: subtotal,
                paymentMethod: 'BANK_TRANSFER',
                paymentStatus: 'PENDING',
            },
        });
        return {
            message: 'Pesanan berhasil dibuat. Silakan upload bukti pembayaran.',
            orderId: order.id,
            totalAmount: subtotal,
            status: 'PENDING',
            instruction: 'Gunakan endpoint POST /payment/upload-proof/:orderId untuk mengunggah bukti pembayaran',
        };
    }
    getMyOrders(userId) {
        const userIdNumber = Number(userId);
        return this.prisma.order.findMany({
            where: { userId: userIdNumber },
            include: {
                orderItems: {
                    include: { product: { select: { name: true, imageUrl: true } } },
                },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    getAllOrders() {
        return this.prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                orderItems: { include: { product: { select: { name: true } } } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(orderId, dto) {
        const orderIdNumber = Number(orderId);
        const order = await this.prisma.order.findUnique({
            where: { id: orderIdNumber },
        });
        if (!order)
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        return this.prisma.order.update({
            where: { id: orderIdNumber },
            data: { status: dto.status },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cart_service_1.CartService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map