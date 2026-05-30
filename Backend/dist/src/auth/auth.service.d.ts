import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: RegisterDto): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                address: string | null;
                createdAt: Date;
            };
        };
    }>;
    registerAdmin(data: RegisterAdminDto): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                address: string | null;
                createdAt: Date;
            };
        };
    }>;
    private createUser;
    login(data: LoginDto): Promise<{
        statusCode: number;
        message: string;
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                address: string | null;
                createdAt: Date;
            };
            access_token: string;
        };
    }>;
}
