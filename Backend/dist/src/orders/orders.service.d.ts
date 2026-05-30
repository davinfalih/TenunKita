import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private prisma;
    private cartService;
    constructor(prisma: PrismaService, cartService: CartService);
    checkout(userId: string | number): Promise<{
        message: string;
        orderId: number;
        totalAmount: number;
        status: string;
        instruction: string;
    }>;
    getMyOrders(userId: string | number): import(".prisma/client").Prisma.PrismaPromise<({
        payment: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            amount: number;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paidAt: Date | null;
            orderId: number;
        } | null;
        orderItems: ({
            product: {
                name: string;
                imageUrl: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    })[]>;
    getOrderById(userId: string | number, role: string, orderId: string | number): Promise<{
        user: {
            name: string;
            email: string;
        };
        payment: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            amount: number;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paidAt: Date | null;
            orderId: number;
        } | null;
        orderItems: ({
            product: {
                name: string;
                price: number;
                imageUrl: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
        paymentProofs: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentProofStatus;
            orderId: number;
            adminNote: string | null;
            fileUrl: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    }>;
    getAllOrders(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            email: string;
        };
        payment: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            amount: number;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paidAt: Date | null;
            orderId: number;
        } | null;
        orderItems: ({
            product: {
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    })[]>;
    updateStatus(orderId: string | number, dto: UpdateOrderStatusDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    }>;
}
