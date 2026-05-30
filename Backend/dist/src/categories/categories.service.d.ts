import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            products: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    })[]>;
    findOne(id: string | number): Promise<{
        products: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            stock: number;
            categoryId: number;
            imageUrl: string | null;
            averageRating: number;
            totalReviews: number;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    update(id: string | number, dto: Partial<CreateCategoryDto>): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    remove(id: string | number): Promise<{
        message: string;
    }>;
}
