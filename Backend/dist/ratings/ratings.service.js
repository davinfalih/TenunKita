"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RatingsService = class RatingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        if (!data.productId)
            throw new common_1.BadRequestException('productId is required');
        if (data.score == null)
            throw new common_1.BadRequestException('score is required');
        if (data.score < 1 || data.score > 5)
            throw new common_1.BadRequestException('score must be between 1 and 5');
        const product = await this.prisma.product.findUnique({
            where: { id: Number(data.productId) },
        });
        if (!product)
            throw new common_1.NotFoundException(`Product with id ${data.productId} not found`);
        const user = await this.prisma.user.findUnique({
            where: { id: Number(userId) },
        });
        if (!user)
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        const existingRating = await this.prisma.rating.findFirst({
            where: { productId: Number(data.productId), userId: Number(userId) },
        });
        if (existingRating)
            throw new common_1.ConflictException(`User with id ${userId} has already rated this product`);
        const rating = await this.prisma.rating.create({
            data: {
                score: Number(data.score),
                comment: data.comment || null,
                productId: Number(data.productId),
                userId: Number(userId),
            },
        });
        const agg = await this.prisma.rating.aggregate({
            where: { productId: Number(data.productId) },
            _avg: { score: true },
            _count: { score: true },
        });
        await this.prisma.product.update({
            where: { id: Number(data.productId) },
            data: {
                averageRating: agg._avg.score || 0,
                totalReviews: agg._count.score || 0,
            },
        });
        return rating;
    }
    async findByProduct(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: Number(productId) },
        });
        if (!product)
            throw new common_1.NotFoundException(`Product with id ${productId} not found`);
        return await this.prisma.rating.findMany({
            where: { productId: Number(productId) },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map