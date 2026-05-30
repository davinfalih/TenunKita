import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(req: any, dto: AddToCartDto): Promise<{
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
    getCart(req: any): Promise<{
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
    updateItem(req: any, itemId: string, dto: UpdateCartDto): Promise<{
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
    removeItem(req: any, itemId: string): Promise<{
        message: string;
    }>;
}
