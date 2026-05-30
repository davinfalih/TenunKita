import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string | number): Promise<{
        id: number;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        address: string | null;
        createdAt: Date;
    }>;
    updateProfile(userId: string | number, data: {
        name?: string;
        address?: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        address: string | null;
    }>;
    getAllUsers(): Promise<{
        id: number;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    getUserById(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        address: string | null;
        createdAt: Date;
    }>;
    updateUserById(id: number, data: {
        name?: string;
        address?: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        address: string | null;
    }>;
    deleteUserById(id: number): Promise<{
        message: string;
    }>;
}
