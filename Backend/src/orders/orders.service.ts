import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { PromosService } from '../promos/promos.service';
import { OrderStatus } from '@prisma/client';
import PDFDocument from 'pdfkit';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private promosService: PromosService,
  ) {}

  // ─── CHECKOUT ────────────────────────────────────────────────────────────────
  async checkout(userId: string | number, dto: CheckoutDto) {
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

    let discountAmount = 0;
    let promoId: number | null = null;
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

    // Buat order di database dengan status PENDING
    const order = await this.prisma.order.create({
      data: {
        userId: userIdNumber,
        totalAmount: finalAmount,
        discountAmount: discountAmount,
        promoId: promoId,
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

    // Update promo usedCount jika ada promo yang digunakan
    if (promoId) {
      await this.prisma.promo.update({
        where: { id: promoId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Buat Payment record dengan status PENDING
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
        promo: true,
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
        promo: true,
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

  // ─── GENERATE PDF RECEIPT ───────────────────────────────────────────────
  async generateReceiptPdf(
    userId: number,
    role: string,
    orderId: number,
  ): Promise<Buffer> {
    const order = await this.getOrderById(userId, role, orderId);

    const formatRupiah = (value: number) => {
      return 'Rp ' + value.toLocaleString('id-ID');
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    };

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Colors & Theme (Traditional Elegance - Brown, Gold, Charcoal)
      const brandColor = '#4A2E1B';  // Dark Brown
      const accentColor = '#D4AF37'; // Gold
      const textColor = '#2D3748';   // Charcoal
      const tableHeaderBg = '#4A2E1B';

      // 1. Header (TenunKita Branding)
      doc.fillColor(brandColor)
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('TENUNKITA', { align: 'left' });
      
      doc.fontSize(10)
         .font('Helvetica-Oblique')
         .fillColor('#718096')
         .text('Sentuhan Tradisional, Kemewahan Modern', { align: 'left' });
      
      doc.moveDown(0.5);

      // Draw gold accent bar
      doc.strokeColor(accentColor)
         .lineWidth(2)
         .moveTo(50, doc.y)
         .lineTo(545, doc.y)
         .stroke();
      
      doc.moveDown(1.5);

      // 2. Receipt Title
      doc.fillColor(textColor)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('STRUK PEMBAYARAN', { align: 'center' });
      
      doc.moveDown(1.5);

      // 3. Metadata Grid (Order info vs Customer info)
      const gridY = doc.y;
      
      // Left Column: Order Information
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor(brandColor)
         .text('INFORMASI PESANAN', 50, gridY);
      
      doc.font('Helvetica')
         .fillColor(textColor);
      doc.text(`No. Invoice: #TK-${order.id.toString().padStart(5, '0')}`, 50, gridY + 18);
      doc.text(`Tanggal: ${formatDate(order.createdAt)}`, 50, gridY + 32);
      doc.text(`Metode Bayar: ${order.payment?.paymentMethod || 'BANK_TRANSFER'}`, 50, gridY + 46);

      // Right Column: Customer Information
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

      // 4. Products Table
      const tableTop = doc.y;
      
      // Table Header Background
      doc.rect(50, tableTop, 495, 22).fill(tableHeaderBg);
      
      // Table Header Text
      doc.fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .fontSize(9);
      doc.text('No', 60, tableTop + 6);
      doc.text('Nama Produk', 90, tableTop + 6);
      doc.text('Qty', 330, tableTop + 6, { width: 30, align: 'center' });
      doc.text('Harga Satuan', 370, tableTop + 6, { width: 80, align: 'right' });
      doc.text('Subtotal', 460, tableTop + 6, { width: 80, align: 'right' });

      // Table Body Rows
      let currentY = tableTop + 22;
      order.orderItems.forEach((item, index) => {
        // Alternating row background
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

      // Solid divider line after table
      doc.strokeColor('#E2E8F0')
         .lineWidth(1)
         .moveTo(50, currentY)
         .lineTo(545, currentY)
         .stroke();
      
      currentY += 10;

      // 5. Total Payment Summary
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

      // Draw a line before total
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

      // 6. Footer (Elegant closing message)
      doc.fillColor('#718096')
         .font('Helvetica-Oblique')
         .fontSize(9);
      doc.text('Terima kasih atas pembelian Anda!', 50, currentY, { align: 'center', width: 495 });
      doc.text('Pesanan Anda membantu melestarikan warisan budaya tenun Indonesia.', 50, currentY + 15, { align: 'center', width: 495 });

      doc.end();
    });
  }
}
