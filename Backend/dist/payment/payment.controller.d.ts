import { PaymentService } from './payment.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    uploadPaymentProof(orderId: number, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            status: import(".prisma/client").$Enums.PaymentProofStatus;
            orderId: number;
            fileUrl: string;
            adminNote: string | null;
        };
    }>;
    getPaymentProof(orderId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import(".prisma/client").$Enums.PaymentProofStatus;
        orderId: number;
        fileUrl: string;
        adminNote: string | null;
    }[]>;
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
    verifyPayment(id: number, verifyPaymentDto: VerifyPaymentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            status: import(".prisma/client").$Enums.PaymentProofStatus;
            orderId: number;
            fileUrl: string;
            adminNote: string | null;
        };
    }>;
    deletePayment(id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        orderId: number;
        amount: number;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paidAt: Date | null;
    }>;
}
