import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { PromosService } from '../promos/promos.service';
export declare class OrdersService {
    private prisma;
    private cartService;
    private promosService;
    constructor(prisma: PrismaService, cartService: CartService, promosService: PromosService);
    checkout(userId: string | number, dto: CheckoutDto): Promise<{
        message: string;
        orderId: number;
        subtotal: number;
        discountAmount: number;
        promoCode: string;
        totalAmount: number;
        status: string;
        instruction: string;
    }>;
    getMyOrders(userId: string | number): import(".prisma/client").Prisma.PrismaPromise<({
        payment: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            orderId: number;
            amount: number;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paidAt: Date | null;
        };
        promo: {
            type: import(".prisma/client").$Enums.PromoType;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            code: string;
            value: number;
            maxDiscount: number | null;
            minOrderAmount: number;
            startDate: Date;
            endDate: Date;
            usageLimit: number | null;
            isActive: boolean;
            usedCount: number;
        };
        orderItems: ({
            product: {
                name: string;
                imageUrl: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            price: number;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        discountAmount: number;
        totalAmount: number;
        promoId: number | null;
    })[]>;
    getOrderById(userId: string | number, role: string, orderId: string | number): Promise<{
        user: {
            name: string;
            email: string;
        };
        payment: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            orderId: number;
            amount: number;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paidAt: Date | null;
        };
        promo: {
            type: import(".prisma/client").$Enums.PromoType;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            code: string;
            value: number;
            maxDiscount: number | null;
            minOrderAmount: number;
            startDate: Date;
            endDate: Date;
            usageLimit: number | null;
            isActive: boolean;
            usedCount: number;
        };
        orderItems: ({
            product: {
                name: string;
                price: number;
                imageUrl: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            price: number;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
        paymentProofs: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            status: import(".prisma/client").$Enums.PaymentProofStatus;
            orderId: number;
            fileUrl: string;
            adminNote: string | null;
        }[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        discountAmount: number;
        totalAmount: number;
        promoId: number | null;
    }>;
    getAllOrders(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            email: string;
        };
        payment: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            orderId: number;
            amount: number;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paidAt: Date | null;
        };
        orderItems: ({
            product: {
                name: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            price: number;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        discountAmount: number;
        totalAmount: number;
        promoId: number | null;
    })[]>;
    updateStatus(orderId: string | number, dto: UpdateOrderStatusDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        discountAmount: number;
        totalAmount: number;
        promoId: number | null;
    }>;
    deleteOrder(orderId: string | number, userId: string | number, role: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        discountAmount: number;
        totalAmount: number;
        promoId: number | null;
    }>;
    generateReceiptPdf(userId: number, role: string, orderId: number): Promise<Buffer>;
}
