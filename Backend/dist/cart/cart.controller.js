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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const cart_dto_1 = require("./dto/cart.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    addToCart(req, dto) {
        return this.cartService.addToCart(req.user.sub, dto);
    }
    getCart(req) {
        return this.cartService.getCart(req.user.sub);
    }
    updateItem(req, itemId, dto) {
        return this.cartService.updateItem(req.user.sub, itemId, dto);
    }
    removeItem(req, itemId) {
        return this.cartService.removeItem(req.user.sub, itemId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tambah item ke keranjang belanja' }),
    (0, swagger_1.ApiBody)({ type: cart_dto_1.AddToCartDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item berhasil ditambahkan ke keranjang' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cart_dto_1.AddToCartDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lihat isi keranjang belanja user yang sedang login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Isi keranjang berhasil diambil' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Patch)(':itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update jumlah item di keranjang' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'ID item keranjang', example: '1' }),
    (0, swagger_1.ApiBody)({ type: cart_dto_1.UpdateCartDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item keranjang berhasil diupdate' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item tidak ditemukan di keranjang' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cart_dto_1.UpdateCartDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Hapus item dari keranjang belanja' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'ID item keranjang', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item berhasil dihapus dari keranjang' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item tidak ditemukan di keranjang' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('carts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'BUYER'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map