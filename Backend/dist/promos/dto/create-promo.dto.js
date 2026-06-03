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
exports.CreatePromoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreatePromoDto {
}
exports.CreatePromoDto = CreatePromoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DISKON50', description: 'Kode promo unik' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromoDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Diskon 50% hingga Rp 20.000', description: 'Deskripsi promo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromoDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PERCENTAGE', enum: ['PERCENTAGE', 'FIXED'], description: 'Tipe diskon' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(client_1.PromoType),
    __metadata("design:type", String)
], CreatePromoDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Nilai diskon (persen atau rupiah)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePromoDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20000, description: 'Maksimal potongan harga untuk tipe persentase' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePromoDto.prototype, "maxDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Minimal pembelian untuk menggunakan promo' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePromoDto.prototype, "minOrderAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-01T00:00:00.000Z', description: 'Tanggal mulai berlaku' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromoDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-30T23:59:59.000Z', description: 'Tanggal selesai berlaku' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromoDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100, description: 'Batas total penggunaan promo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePromoDto.prototype, "usageLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Status keaktifan promo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePromoDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-promo.dto.js.map