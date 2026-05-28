import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }

  async getBill(orderId: number) {
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
      throw new NotFoundException('Order not found');
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

  async uploadImage(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'ecommerce_payments' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });
  }

  async uploadPaymentProof(orderId: number, file: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!['PENDING', 'WAITING_VERIFICATION'].includes(order.status)) {
      throw new BadRequestException(
        'Order must be PENDING or WAITING_VERIFICATION before uploading proof',
      );
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

  async getPaymentProof(orderId: number) {
    const proofs = await this.prisma.paymentProof.findMany({
      where: { orderId },
    });

    if (proofs.length === 0) {
      throw new NotFoundException('No payment proof found for this order');
    }

    return proofs;
  }

  async verifyPayment(paymentProofId: number, verifyDto: VerifyPaymentDto) {
    const paymentProof = await this.prisma.paymentProof.findUnique({
      where: { id: paymentProofId },
      include: { order: true },
    });

    if (!paymentProof) {
      throw new NotFoundException('Payment proof not found');
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
    } else if (verifyDto.status === 'REJECTED') {
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
}
