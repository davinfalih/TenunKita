import { PrismaService } from '../prisma/prisma.service';
export declare class RatingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, data: any): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        productId: number;
        userId: number;
        score: number;
        comment: string | null;
    }>;
    findByProduct(productId: number): Promise<({
        user: {
            name: string;
            email: string;
            id: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        productId: number;
        userId: number;
        score: number;
        comment: string | null;
    })[]>;
}
