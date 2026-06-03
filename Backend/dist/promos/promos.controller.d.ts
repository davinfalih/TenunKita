import { PromosService } from './promos.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { CheckPromoDto } from './dto/check-promo.dto';
export declare class PromosController {
    private readonly promosService;
    constructor(promosService: PromosService);
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdatePromoDto): Promise<{
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
    remove(id: string): Promise<{
        message: string;
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
