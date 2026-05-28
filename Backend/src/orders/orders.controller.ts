import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // User: Checkout dari keranjang
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkout(@Request() req: any) {
    return this.ordersService.checkout(req.user.sub);
  }

  // User: Lihat pesanan saya
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  getMyOrders(@Request() req: any) {
    return this.ordersService.getMyOrders(req.user.sub);
  }

  // Admin: Lihat semua pesanan
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // Admin: Update status pesanan
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
