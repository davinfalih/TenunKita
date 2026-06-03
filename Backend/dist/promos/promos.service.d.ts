import { PrismaService } from '../prisma/prisma.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { CheckPromoDto } from './dto/check-promo.dto';
export declare class PromosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePromoDto): Promise<{
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
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findOne(id: number | string): Promise<{
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
    }>;
    update(id: number | string, dto: UpdatePromoDto): Promise<{
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
    }>;
    remove(id: number | string): Promise<{
        message: string;
    }>;
    validatePromo(code: string, subtotal: number): Promise<{
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
        discountAmount: number;
    }>;
    checkPromo(dto: CheckPromoDto): Promise<{
        valid: boolean;
        code: string;
        type: import(".prisma/client").$Enums.PromoType;
        value: number;
        discountAmount: number;
        finalAmount: number;
    }>;
}
