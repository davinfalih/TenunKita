import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@Request() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.sub, dto);
  }

  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.sub);
  }

  @Patch(':itemId')
  updateItem(@Request() req: any, @Param('itemId') itemId: string, @Body() dto: UpdateCartDto) {
    return this.cartService.updateItem(req.user.sub, itemId, dto);
  }

  @Delete(':itemId')
  removeItem(@Request() req: any, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.sub, itemId);
  }
}
