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
exports.PromosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const promos_service_1 = require("./promos.service");
const create_promo_dto_1 = require("./dto/create-promo.dto");
const update_promo_dto_1 = require("./dto/update-promo.dto");
const check_promo_dto_1 = require("./dto/check-promo.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let PromosController = class PromosController {
    constructor(promosService) {
        this.promosService = promosService;
    }
    create(dto) {
        return this.promosService.create(dto);
    }
    findAll() {
        return this.promosService.findAll();
    }
    findOne(id) {
        return this.promosService.findOne(id);
    }
    update(id, dto) {
        return this.promosService.update(id, dto);
    }
    remove(id) {
        return this.promosService.remove(id);
    }
    checkPromo(dto) {
        return this.promosService.checkPromo(dto);
    }
};
exports.PromosController = PromosController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Tambah kode promo baru' }),
    (0, swagger_1.ApiBody)({ type: create_promo_dto_1.CreatePromoDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kode promo berhasil dibuat' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Kode promo sudah terdaftar' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Akses ditolak - bukan admin' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promo_dto_1.CreatePromoDto]),
    __metadata("design:returntype", void 0)
], PromosController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Lihat semua kode promo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar semua promo berhasil diambil' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Akses ditolak - bukan admin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromosController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Lihat detail kode promo berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID promo', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detail promo ditemukan' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Promo tidak ditemukan' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromosController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Update kode promo berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID promo', example: '1' }),
    (0, swagger_1.ApiBody)({ type: update_promo_dto_1.UpdatePromoDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kode promo berhasil diupdate' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Promo tidak ditemukan' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_promo_dto_1.UpdatePromoDto]),
    __metadata("design:returntype", void 0)
], PromosController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Hapus kode promo berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID promo', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kode promo berhasil dihapus' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Promo tidak ditemukan' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromosController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'BUYER'),
    (0, common_1.Post)('check'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cek validitas kode promo dan hitung potongan harga' }),
    (0, swagger_1.ApiBody)({ type: check_promo_dto_1.CheckPromoDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kode promo valid dan kalkulasi dikembalikan' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Kode promo tidak aktif, kadaluarsa, kuota habis, atau minimal belanja kurang' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kode promo tidak ditemukan' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_promo_dto_1.CheckPromoDto]),
    __metadata("design:returntype", void 0)
], PromosController.prototype, "checkPromo", null);
exports.PromosController = PromosController = __decorate([
    (0, swagger_1.ApiTags)('promos'),
    (0, common_1.Controller)('promos'),
    __metadata("design:paramtypes", [promos_service_1.PromosService])
], PromosController);
//# sourceMappingURL=promos.controller.js.map