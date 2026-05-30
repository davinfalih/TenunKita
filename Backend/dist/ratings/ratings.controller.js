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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ratings_service_1 = require("./ratings.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let RatingsController = class RatingsController {
    constructor(ratingsService) {
        this.ratingsService = ratingsService;
    }
    create(req, data) {
        return this.ratingsService.create(req.user.sub, data);
    }
    findByProduct(productId) {
        return this.ratingsService.findByProduct(productId);
    }
    update(req, id, data) {
        return this.ratingsService.update(id, req.user.sub, req.user.role, data);
    }
    remove(req, id) {
        return this.ratingsService.remove(id, req.user.sub, req.user.role);
    }
};
exports.RatingsController = RatingsController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buat rating/ulasan untuk produk yang sudah dibeli' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                productId: { type: 'number', example: 1 },
                rating: { type: 'number', example: 5, minimum: 1, maximum: 5 },
                comment: { type: 'string', example: 'Produk sangat bagus dan berkualitas!' },
            },
            required: ['productId', 'rating'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Rating berhasil dibuat' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lihat semua rating untuk suatu produk (publik)' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'ID produk', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar rating berhasil diambil' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produk tidak ditemukan' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "findByProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update rating yang sudah dibuat' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID rating', example: 1 }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                score: { type: 'number', example: 4, minimum: 1, maximum: 5 },
                comment: { type: 'string', example: 'Produk cukup bagus' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rating berhasil diupdate' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Tidak ada izin untuk update' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rating tidak ditemukan' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Hapus rating yang sudah dibuat' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID rating', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rating berhasil dihapus' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Tidak ada izin untuk menghapus' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rating tidak ditemukan' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "remove", null);
exports.RatingsController = RatingsController = __decorate([
    (0, swagger_1.ApiTags)('ratings'),
    (0, common_1.Controller)('ratings'),
    __metadata("design:paramtypes", [ratings_service_1.RatingsService])
], RatingsController);
//# sourceMappingURL=ratings.controller.js.map