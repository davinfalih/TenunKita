import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
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
    findOne(id: string): Promise<{
        products: {
            description: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            price: number;
            stock: number;
            imageUrl: string | null;
            categoryId: number;
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
    update(id: string, dto: Partial<CreateCategoryDto>): Promise<{
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
