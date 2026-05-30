import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: Partial<CreateCategoryDto>): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
