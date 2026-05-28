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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let PaymentService = class PaymentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });
    }
    async getBill(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: { product: { select: { name: true, price: true } } },
                },
                user: { select: { id: true, name: true, email: true } },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return {
            orderId: order.id,
            userId: order.userId,
            buyerName: order.user.name,
            buyerEmail: order.user.email,
            totalAmount: order.totalAmount,
            status: order.status,
            items: order.orderItems.map((item) => ({
                productName: item.product.name,
                quantity: item.quantity,
                price: item.price,
            })),
            createdAt: order.createdAt,
        };
    }
    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const upload = cloudinary_1.v2.uploader.upload_stream({ folder: 'ecommerce_payments' }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result.secure_url);
            });
            stream_1.Readable.from(file.buffer).pipe(upload);
        });
    }
    async uploadPaymentProof(orderId, file) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (!['PENDING', 'WAITING_VERIFICATION'].includes(order.status)) {
            throw new common_1.BadRequestException('Order must be PENDING or WAITING_VERIFICATION before uploading proof');
        }
        const fileUrl = await this.uploadImage(file);
        const paymentProof = await this.prisma.paymentProof.create({
            data: {
                orderId,
                fileUrl,
            },
        });
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'WAITING_VERIFICATION' },
        });
        return {
            success: true,
            message: 'Payment proof uploaded successfully',
            data: paymentProof,
        };
    }
    async getPaymentProof(orderId) {
        const proofs = await this.prisma.paymentProof.findMany({
            where: { orderId },
        });
        if (proofs.length === 0) {
            throw new common_1.NotFoundException('No payment proof found for this order');
        }
        return proofs;
    }
    async verifyPayment(paymentProofId, verifyDto) {
        const paymentProof = await this.prisma.paymentProof.findUnique({
            where: { id: paymentProofId },
            include: { order: true },
        });
        if (!paymentProof) {
            throw new common_1.NotFoundException('Payment proof not found');
        }
        const updatedProof = await this.prisma.paymentProof.update({
            where: { id: paymentProofId },
            data: {
                status: verifyDto.status,
                adminNote: verifyDto.adminNote,
            },
        });
        if (verifyDto.status === 'APPROVED') {
            await this.prisma.order.update({
                where: { id: paymentProof.orderId },
                data: { status: 'PAID' },
            });
        }
        else if (verifyDto.status === 'REJECTED') {
            await this.prisma.order.update({
                where: { id: paymentProof.orderId },
                data: { status: 'REJECTED' },
            });
        }
        return {
            success: true,
            message: `Payment status updated to ${verifyDto.status}`,
            data: updatedProof,
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map