import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadImage(file: any): Promise<string>;
    create(dto: CreateProductDto, file?: any): Promise<{
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            description: string | null;
        };
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
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
            name: string;
            id: number;
        };
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        stock: number;
        categoryId: number;
        imageUrl: string | null;
        averageRating: number;
        totalReviews: number;
    })[]>;
    findOne(id: string | number): Promise<{
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            description: string | null;
        };
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        stock: number;
        categoryId: number;
        imageUrl: string | null;
        averageRating: number;
        totalReviews: number;
    }>;
    update(id: string | number, dto: UpdateProductDto, file?: any): Promise<{
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            description: string | null;
        };
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        stock: number;
        categoryId: number;
        imageUrl: string | null;
        averageRating: number;
        totalReviews: number;
    }>;
    remove(id: string | number): Promise<{
        message: string;
    }>;
}
