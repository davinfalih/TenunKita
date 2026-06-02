import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            products: number;
        };
    } & {
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    })[]>;
    findOne(id: string | number): Promise<{
        products: {
            description: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            price: number;
            stock: number;
            categoryId: number;
            imageUrl: string | null;
            averageRating: number;
            totalReviews: number;
        }[];
    } & {
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: string | number, dto: Partial<CreateCategoryDto>): Promise<{
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: string | number): Promise<{
        message: string;
    }>;
}
