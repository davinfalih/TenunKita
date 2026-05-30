import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
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
    registerAdmin(dto: RegisterAdminDto): Promise<{
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
    login(dto: LoginDto): Promise<{
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
