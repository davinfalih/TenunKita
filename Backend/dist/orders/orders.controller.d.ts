import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(req: any): Promise<{
        message: string;
        orderId: number;
        totalAmount: number;
        status: string;
        instruction: string;
    }>;
    getMyOrders(req: any): import(".prisma/client").Prisma.PrismaPromise<({
        payment: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
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
        totalAmount: number;
    })[]>;
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
        totalAmount: number;
    })[]>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    }>;
}
