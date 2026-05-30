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
exports.RegisterAdminDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const register_dto_1 = require("./register.dto");
class RegisterAdminDto extends register_dto_1.RegisterDto {
}
exports.RegisterAdminDto = RegisterAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AdminSecret123', description: 'Secret key khusus untuk mendaftarkan admin' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Admin secret tidak boleh kosong' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterAdminDto.prototype, "adminSecret", void 0);
//# sourceMappingURL=register-admin.dto.js.map