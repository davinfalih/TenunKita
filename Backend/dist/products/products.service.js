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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });
    }
    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const upload = cloudinary_1.v2.uploader.upload_stream({ folder: 'ecommerce_products' }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result.secure_url);
            });
            stream_1.Readable.from(file.buffer).pipe(upload);
        });
    }
    async create(dto, file) {
        let imageUrl;
        if (file) {
            imageUrl = await this.uploadImage(file);
        }
        return this.prisma.product.create({
            data: {
                ...dto,
                price: Number(dto.price),
                stock: Number(dto.stock),
                imageUrl,
            },
            include: { category: true },
        });
    }
    findAll(search, categoryId) {
        const categoryNumber = categoryId ? Number(categoryId) : undefined;
        return this.prisma.product.findMany({
            where: {
                ...(search && { name: { contains: search } }),
                ...(categoryNumber && { categoryId: categoryNumber }),
            },
            include: { category: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const productId = Number(id);
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { category: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Produk tidak ditemukan');
        return product;
    }
    async update(id, dto, file) {
        const productId = Number(id);
        await this.findOne(productId);
        let imageUrl;
        if (file) {
            imageUrl = await this.uploadImage(file);
        }
        return this.prisma.product.update({
            where: { id: productId },
            data: { ...dto, ...(imageUrl && { imageUrl }) },
            include: { category: true },
        });
    }
    async remove(id) {
        const productId = Number(id);
        await this.findOne(productId);
        await this.prisma.product.delete({ where: { id: productId } });
        return { message: 'Produk berhasil dihapus' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map