import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(dto: CreateProductDto, file: Express.Multer.File): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
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
    }>;
    findAll(search?: string, categoryId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            id: number;
            name: string;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
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
    }>;
    update(id: string, dto: UpdateProductDto, file: Express.Multer.File): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
