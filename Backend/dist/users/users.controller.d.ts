import { UsersService } from './users.service';
declare class UpdateProfileDto {
    name?: string;
    address?: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        name: string;
        email: string;
        address: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        id: number;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
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
    getUserById(id: string): Promise<{
        name: string;
        email: string;
        address: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        id: number;
    }>;
    updateUserById(id: string, dto: UpdateProfileDto): Promise<{
        name: string;
        email: string;
        address: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    deleteUserById(id: string): Promise<{
        message: string;
    }>;
}
export {};
