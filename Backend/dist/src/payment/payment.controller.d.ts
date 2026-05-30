import { PaymentService } from './payment.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    uploadPaymentProof(orderId: number, file: Express.Multer.File): Promise<{
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
