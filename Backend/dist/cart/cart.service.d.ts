import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    addToCart(userId: string | number, dto: AddToCartDto): Promise<{
        product: {
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
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        productId: number;
        quantity: number;
        userId: number;
    }>;
    getCart(userId: string | number): Promise<{
        items: ({
            product: {
                category: {
                    name: string;
                };
            } & {
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
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            productId: number;
            quantity: number;
            userId: number;
        })[];
        subtotal: number;
    }>;
    updateItem(userId: string | number, itemId: string | number, dto: UpdateCartDto): Promise<{
        product: {
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
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        productId: number;
        quantity: number;
        userId: number;
    }>;
    removeItem(userId: string | number, itemId: string | number): Promise<{
        message: string;
    }>;
    clearCart(userId: string | number): Promise<void>;
}
