import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string | number): Promise<{
        name: string;
        email: string;
        address: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        id: number;
    }>;
    updateProfile(userId: string | number, data: {
        name?: string;
        address?: string;
    }): Promise<{
        name: string;
        email: string;
        address: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    getAllUsers(): Promise<{
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        id: number;
    }[]>;
    getUserById(id: number): Promise<{
        name: string;
        email: string;
        address: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        id: number;
    }>;
    updateUserById(id: number, data: {
        name?: string;
        address?: string;
    }): Promise<{
        name: string;
        email: string;
        address: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    deleteUserById(id: number): Promise<{
        message: string;
    }>;
}
