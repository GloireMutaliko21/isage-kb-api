import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RolesGuard } from '../roles/guards';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';
import { JwtGuard } from '../auth/guards';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('order')
@Roles(Role.Admin, Role.DuPatr)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }

  @Get('historic')
  getHostoricClosed() {
    return this.orderService.getHostoricClosed();
  }

  @Patch('close/:id')
  closeOrder(@Param('id') id: string) {
    return this.orderService.closeOrder(id);
  }

  @Patch('cancel/:id')
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
