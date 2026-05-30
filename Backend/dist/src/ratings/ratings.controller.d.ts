import { RatingsService } from './ratings.service';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    create(req: any, data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        userId: number;
        score: number;
        comment: string | null;
    }>;
    findByProduct(productId: number): Promise<({
        user: {
            id: number;
            name: string;
            email: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        userId: number;
        score: number;
        comment: string | null;
    })[]>;
    update(req: any, id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        userId: number;
        score: number;
        comment: string | null;
    }>;
    remove(req: any, id: number): Promise<{
        message: string;
    }>;
}
