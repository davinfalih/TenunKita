import { UsersService } from './users.service';
declare class UpdateProfileDto {
    name?: string;
    address?: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: number;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        address: string | null;
        createdAt: Date;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
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
    getUserById(id: string): Promise<{
        id: number;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        address: string | null;
        createdAt: Date;
    }>;
    updateUserById(id: string, dto: UpdateProfileDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        address: string | null;
    }>;
    deleteUserById(id: string): Promise<{
        message: string;
    }>;
}
export {};
