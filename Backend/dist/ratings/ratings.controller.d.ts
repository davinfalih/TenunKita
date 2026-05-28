import { RatingsService } from './ratings.service';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    create(req: any, data: any): Promise<{
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
