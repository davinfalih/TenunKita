import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    addToCart(userId: string | number, dto: AddToCartDto): Promise<{
        product: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
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
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            quantity: number;
            userId: number;
        })[];
        subtotal: number;
    }>;
    updateItem(userId: string | number, itemId: string | number, dto: UpdateCartDto): Promise<{
        product: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        quantity: number;
        userId: number;
    }>;
    removeItem(userId: string | number, itemId: string | number): Promise<{
        message: string;
    }>;
    clearCart(userId: string | number): Promise<void>;
}
