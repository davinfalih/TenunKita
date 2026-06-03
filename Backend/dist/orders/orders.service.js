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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cart_service_1 = require("../cart/cart.service");
const promos_service_1 = require("../promos/promos.service");
const client_1 = require("@prisma/client");
const pdfkit_1 = __importDefault(require("pdfkit"));
let OrdersService = class OrdersService {
    constructor(prisma, cartService, promosService) {
        this.prisma = prisma;
        this.cartService = cartService;
        this.promosService = promosService;
    }
    async checkout(userId, dto) {
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
        let discountAmount = 0;
        let promoId = null;
        let promoCodeUsed = '';
        if (dto.promoCode) {
            const promoResult = await this.promosService.validatePromo(dto.promoCode, subtotal);
            discountAmount = promoResult.discountAmount;
            promoId = promoResult.promo.id;
            promoCodeUsed = promoResult.promo.code;
        }
        const finalAmount = subtotal - discountAmount;
        const user = await this.prisma.user.findUnique({
            where: { id: userIdNumber },
        });
        const order = await this.prisma.order.create({
            data: {
                userId: userIdNumber,
                totalAmount: finalAmount,
                discountAmount: discountAmount,
                promoId: promoId,
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
        if (promoId) {
            await this.prisma.promo.update({
                where: { id: promoId },
                data: { usedCount: { increment: 1 } },
            });
        }
        await this.prisma.payment.create({
            data: {
                orderId: order.id,
                userId: userIdNumber,
                amount: finalAmount,
                paymentMethod: 'BANK_TRANSFER',
                paymentStatus: 'PENDING',
            },
        });
        return {
            message: 'Pesanan berhasil dibuat. Silakan upload bukti pembayaran.',
            orderId: order.id,
            subtotal,
            discountAmount,
            promoCode: promoCodeUsed || null,
            totalAmount: finalAmount,
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
                promo: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getOrderById(userId, role, orderId) {
        const orderIdNumber = Number(orderId);
        const userIdNumber = Number(userId);
        const order = await this.prisma.order.findUnique({
            where: { id: orderIdNumber },
            include: {
                user: { select: { name: true, email: true } },
                orderItems: {
                    include: {
                        product: { select: { name: true, imageUrl: true, price: true } },
                    },
                },
                payment: true,
                paymentProofs: true,
                promo: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (role !== 'ADMIN' && order.userId !== userIdNumber) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan atau tidak ada akses');
        }
        return order;
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
    async deleteOrder(orderId, userId, role) {
        const id = Number(orderId);
        const userIdNumber = Number(userId);
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (role !== 'ADMIN' && order.userId !== userIdNumber) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan atau tidak ada akses');
        }
        await this.prisma.orderItem.deleteMany({
            where: { orderId: id },
        });
        return this.prisma.order.delete({
            where: { id },
        });
    }
    async generateReceiptPdf(userId, role, orderId) {
        const order = await this.getOrderById(userId, role, orderId);
        const formatRupiah = (value) => {
            return 'Rp ' + value.toLocaleString('id-ID');
        };
        const formatDate = (date) => {
            return new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(date);
        };
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50, size: 'A4' });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));
            const brandColor = '#4A2E1B';
            const accentColor = '#D4AF37';
            const textColor = '#2D3748';
            const tableHeaderBg = '#4A2E1B';
            doc.fillColor(brandColor)
                .fontSize(24)
                .font('Helvetica-Bold')
                .text('TENUNKITA', { align: 'left' });
            doc.fontSize(10)
                .font('Helvetica-Oblique')
                .fillColor('#718096')
                .text('Sentuhan Tradisional, Kemewahan Modern', { align: 'left' });
            doc.moveDown(0.5);
            doc.strokeColor(accentColor)
                .lineWidth(2)
                .moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke();
            doc.moveDown(1.5);
            doc.fillColor(textColor)
                .fontSize(16)
                .font('Helvetica-Bold')
                .text('STRUK PEMBAYARAN', { align: 'center' });
            doc.moveDown(1.5);
            const gridY = doc.y;
            doc.fontSize(10)
                .font('Helvetica-Bold')
                .fillColor(brandColor)
                .text('INFORMASI PESANAN', 50, gridY);
            doc.font('Helvetica')
                .fillColor(textColor);
            doc.text(`No. Invoice: #TK-${order.id.toString().padStart(5, '0')}`, 50, gridY + 18);
            doc.text(`Tanggal: ${formatDate(order.createdAt)}`, 50, gridY + 32);
            doc.text(`Metode Bayar: ${order.payment?.paymentMethod || 'BANK_TRANSFER'}`, 50, gridY + 46);
            doc.font('Helvetica-Bold')
                .fillColor(brandColor)
                .text('PELANGGAN', 320, gridY);
            doc.font('Helvetica')
                .fillColor(textColor);
            doc.text(`Nama: ${order.user?.name || '-'}`, 320, gridY + 18);
            doc.text(`Email: ${order.user?.email || '-'}`, 320, gridY + 32);
            doc.text(`Status Pesanan: ${order.status}`, 320, gridY + 46);
            doc.y = gridY + 80;
            doc.moveDown(1.5);
            const tableTop = doc.y;
            doc.rect(50, tableTop, 495, 22).fill(tableHeaderBg);
            doc.fillColor('#FFFFFF')
                .font('Helvetica-Bold')
                .fontSize(9);
            doc.text('No', 60, tableTop + 6);
            doc.text('Nama Produk', 90, tableTop + 6);
            doc.text('Qty', 330, tableTop + 6, { width: 30, align: 'center' });
            doc.text('Harga Satuan', 370, tableTop + 6, { width: 80, align: 'right' });
            doc.text('Subtotal', 460, tableTop + 6, { width: 80, align: 'right' });
            let currentY = tableTop + 22;
            order.orderItems.forEach((item, index) => {
                if (index % 2 === 1) {
                    doc.rect(50, currentY, 495, 20).fill('#F7FAFC');
                }
                doc.fillColor(textColor)
                    .font('Helvetica')
                    .fontSize(9);
                doc.text((index + 1).toString(), 60, currentY + 5);
                doc.text(item.product.name, 90, currentY + 5, { width: 230, lineBreak: false });
                doc.text(item.quantity.toString(), 330, currentY + 5, { width: 30, align: 'center' });
                doc.text(formatRupiah(item.price), 370, currentY + 5, { width: 80, align: 'right' });
                doc.text(formatRupiah(item.price * item.quantity), 460, currentY + 5, { width: 80, align: 'right' });
                currentY += 20;
            });
            doc.strokeColor('#E2E8F0')
                .lineWidth(1)
                .moveTo(50, currentY)
                .lineTo(545, currentY)
                .stroke();
            currentY += 10;
            const calculatedSubtotal = order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
            doc.fillColor(textColor)
                .font('Helvetica')
                .fontSize(9);
            doc.text('Subtotal:', 280, currentY, { width: 160, align: 'right' });
            doc.text(formatRupiah(calculatedSubtotal), 450, currentY, { width: 90, align: 'right' });
            currentY += 16;
            if (order.discountAmount > 0) {
                doc.text(`Diskon (${order.promo?.code || 'Promo'}):`, 280, currentY, { width: 160, align: 'right' });
                doc.text(`-${formatRupiah(order.discountAmount)}`, 450, currentY, { width: 90, align: 'right' });
                currentY += 16;
            }
            doc.strokeColor('#E2E8F0')
                .lineWidth(0.5)
                .moveTo(280, currentY)
                .lineTo(540, currentY)
                .stroke();
            currentY += 6;
            doc.fillColor(brandColor)
                .font('Helvetica-Bold')
                .fontSize(11);
            doc.text('TOTAL BAYAR:', 280, currentY, { width: 160, align: 'right' });
            doc.fillColor(accentColor)
                .text(formatRupiah(order.totalAmount), 450, currentY, { width: 90, align: 'right' });
            currentY += 50;
            doc.fillColor('#718096')
                .font('Helvetica-Oblique')
                .fontSize(9);
            doc.text('Terima kasih atas pembelian Anda!', 50, currentY, { align: 'center', width: 495 });
            doc.text('Pesanan Anda membantu melestarikan warisan budaya tenun Indonesia.', 50, currentY + 15, { align: 'center', width: 495 });
            doc.end();
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cart_service_1.CartService,
        promos_service_1.PromosService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map