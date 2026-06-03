import { PromoType } from '@prisma/client';
export declare class CreatePromoDto {
    code: string;
    description?: string;
    type: PromoType;
    value: number;
    maxDiscount?: number;
    minOrderAmount: number;
    startDate: string;
    endDate: string;
    usageLimit?: number;
    isActive?: boolean;
}
