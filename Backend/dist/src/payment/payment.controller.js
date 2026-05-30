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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const payment_service_1 = require("./payment.service");
const verify_payment_dto_1 = require("./dto/verify-payment.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async uploadPaymentProof(orderId, file) {
        if (!file) {
            throw new common_1.BadRequestException('file is required');
        }
        return this.paymentService.uploadPaymentProof(orderId, file);
    }
    async getPaymentProof(orderId) {
        return this.paymentService.getPaymentProof(orderId);
    }
    async getBill(orderId) {
        return this.paymentService.getBill(orderId);
    }
    async verifyPayment(id, verifyPaymentDto) {
        return this.paymentService.verifyPayment(id, verifyPaymentDto);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('upload-proof/:orderId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload bukti pembayaran untuk pesanan' }),
    (0, swagger_1.ApiParam)({ name: 'orderId', description: 'ID pesanan', example: 1 }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'File bukti pembayaran (gambar)' },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bukti pembayaran berhasil diupload' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'File tidak ditemukan' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "uploadPaymentProof", null);
__decorate([
    (0, common_1.Get)('proof/:orderId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lihat bukti pembayaran berdasarkan ID pesanan' }),
    (0, swagger_1.ApiParam)({ name: 'orderId', description: 'ID pesanan', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bukti pembayaran ditemukan' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bukti pembayaran tidak ditemukan' }),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentProof", null);
__decorate([
    (0, common_1.Get)('bill/:orderId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lihat tagihan/bill berdasarkan ID pesanan' }),
    (0, swagger_1.ApiParam)({ name: 'orderId', description: 'ID pesanan', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data tagihan ditemukan' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pesanan tidak ditemukan' }),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getBill", null);
__decorate([
    (0, common_1.Patch)('verify/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Verifikasi pembayaran pesanan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID pembayaran', example: 1 }),
    (0, swagger_1.ApiBody)({ type: verify_payment_dto_1.VerifyPaymentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pembayaran berhasil diverifikasi' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Akses ditolak - bukan admin' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pembayaran tidak ditemukan' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, verify_payment_dto_1.VerifyPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verifyPayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payment'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map