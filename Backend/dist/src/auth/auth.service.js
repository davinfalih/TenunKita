"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const role = data.role ?? 'BUYER';
        if (role === 'ADMIN') {
            const secret = process.env.ADMIN_SECRET;
            if (!data.adminSecret || data.adminSecret !== secret) {
                throw new common_1.BadRequestException('adminSecret tidak valid');
            }
        }
        return this.createUser({
            name: data.name,
            email: data.email,
            password: data.password,
            address: data.address,
            role: role,
        });
    }
    async registerAdmin(data) {
        if (data.adminSecret !== process.env.ADMIN_SECRET) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                message: 'Admin secret tidak valid. Pembuatan akun admin ditolak.',
                error: 'UNAUTHORIZED',
            });
        }
        return this.createUser({
            name: data.name,
            email: data.email,
            password: data.password,
            address: data.address,
            role: 'ADMIN',
        });
    }
    async createUser({ name, email, password, address, role, }) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'Email sudah terdaftar!',
                error: 'BAD_REQUEST',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address: address || null,
                role,
            },
        });
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            statusCode: role === 'ADMIN' ? 201 : 201,
            message: role === 'ADMIN'
                ? 'Registrasi admin berhasil! Akun administrator telah dibuat.'
                : 'Registrasi berhasil! Akun Anda telah dibuat.',
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    address: user.address,
                    createdAt: user.createdAt,
                }
            },
        };
    }
    async login(data) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                message: 'Email atau password salah. Silakan periksa kembali.',
                error: 'UNAUTHORIZED',
            });
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                message: 'Email atau password salah. Silakan periksa kembali.',
                error: 'UNAUTHORIZED',
            });
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            statusCode: 200,
            message: `Selamat datang, ${user.name}! Login berhasil.`,
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    address: user.address,
                    createdAt: user.createdAt,
                },
                access_token: accessToken,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map