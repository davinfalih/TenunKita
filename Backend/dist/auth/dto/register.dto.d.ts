import { Role } from '@prisma/client';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    address?: string;
    role?: Role;
    adminSecret?: string;
}
