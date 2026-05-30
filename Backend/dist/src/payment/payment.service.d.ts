import { PrismaService } from '../prisma/prisma.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
export declare class PaymentService {
    private prisma;
    constructor(prisma: PrismaService);
    getBill(orderId: number): Promise<{
        orderId: number;
        userId: number;
        buyerName: string;
        buyerEmail: string;
        totalAmount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        items: {
            productName: string;
            quantity: number;
            price: number;
        }[];
        createdAt: Date;
    }>;
    uploadImage(file: any): Promise<string>;
    uploadPaymentProof(orderId: number, file: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentProofStatus;
            orderId: number;
            adminNote: string | null;
            fileUrl: string;
        };
    }>;
    getPaymentProof(orderId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentProofStatus;
        orderId: number;
        adminNote: string | null;
        fileUrl: string;
    }[]>;
    verifyPayment(paymentProofId: number, verifyDto: VerifyPaymentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentProofStatus;
            orderId: number;
            adminNote: string | null;
            fileUrl: string;
        };
    }>;
}
