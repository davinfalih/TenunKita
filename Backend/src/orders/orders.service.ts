import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  // ─── CHECKOUT ────────────────────────────────────────────────────────────────
  async checkout(userId: string | number) {
    const userIdNumber = Number(userId);
    const { items, subtotal } = await this.cartService.getCart(userIdNumber);

    if (items.length === 0) {
      throw new BadRequestException('Keranjang belanja kosong');
    }

    // Cek stok semua produk
    for (const item of items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Stok produk "${item.product.name}" tidak mencukupi`,
        );
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userIdNumber },
    });

    // Buat order di database dengan status PENDING
    const order = await this.prisma.order.create({
      data: {
        userId: userIdNumber,
        totalAmount: subtotal,
        status: OrderStatus.PENDING,
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

    // Kurangi stok produk
    for (const item of items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Kosongkan keranjang
    await this.cartService.clearCart(userIdNumber);

    // Buat Payment record dengan status PENDING
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
      instruction:
        'Gunakan endpoint POST /payment/upload-proof/:orderId untuk mengunggah bukti pembayaran',
    };
  }

  // ─── LIHAT PESANAN USER ───────────────────────────────────────────────────
  getMyOrders(userId: string | number) {
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

  // ─── LIHAT PESANAN BERDASARKAN ID ─────────────────────────────────────────
  async getOrderById(
    userId: string | number,
    role: string,
    orderId: string | number,
  ) {
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
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    // Jika bukan admin dan pesanan ini bukan milik user yang login
    if (role !== 'ADMIN' && order.userId !== userIdNumber) {
      throw new NotFoundException(
        'Pesanan tidak ditemukan atau tidak ada akses',
      );
    }

    return order;
  }

  // ─── LIHAT SEMUA PESANAN (ADMIN) ──────────────────────────────────────────
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

  // ─── UPDATE STATUS PESANAN (ADMIN) ────────────────────────────────────────
  async updateStatus(orderId: string | number, dto: UpdateOrderStatusDto) {
    const orderIdNumber = Number(orderId);
    const order = await this.prisma.order.findUnique({
      where: { id: orderIdNumber },
    });
    if (!order) throw new NotFoundException('Pesanan tidak ditemukan');

    return this.prisma.order.update({
      where: { id: orderIdNumber },
      data: { status: dto.status as OrderStatus },
    });
  }

  // ─── HAPUS PESANAN (ADMIN/BUYER) ──────────────────────────────────────────
  async deleteOrder(
    orderId: string | number,
    userId: string | number,
    role: string,
  ) {
    const id = Number(orderId);
    const userIdNumber = Number(userId);

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    if (role !== 'ADMIN' && order.userId !== userIdNumber) {
      throw new NotFoundException(
        'Pesanan tidak ditemukan atau tidak ada akses',
      );
    }

    // Hapus OrderItem terlebih dahulu karena tidak ada onCascade Delete di schema Prisma untuk ini
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
