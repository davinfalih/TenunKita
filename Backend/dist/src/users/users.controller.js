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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const class_validator_1 = require("class-validator");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
class UpdateProfileDto {
    name;
    address;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "address", void 0);
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getProfile(req) {
        return this.usersService.getProfile(req.user.sub);
    }
    updateProfile(req, dto) {
        return this.usersService.updateProfile(req.user.sub, dto);
    }
    getAllUsers() {
        return this.usersService.getAllUsers();
    }
    getUserById(id) {
        return this.usersService.getUserById(Number(id));
    }
    updateUserById(id, dto) {
        return this.usersService.updateUserById(Number(id), dto);
    }
    deleteUserById(id) {
        return this.usersService.deleteUserById(Number(id));
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Lihat profil user yang sedang login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data profil berhasil diambil' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update profil user yang sedang login' }),
    (0, swagger_1.ApiBody)({ type: UpdateProfileDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil berhasil diupdate' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Lihat semua user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar semua user' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Akses ditolak - bukan admin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Lihat user berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID user', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data user ditemukan' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User tidak ditemukan' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Update user berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID user', example: 1 }),
    (0, swagger_1.ApiBody)({ type: UpdateProfileDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User berhasil diupdate' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Hapus user berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID user', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User berhasil dihapus' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User tidak ditemukan' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUserById", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map