import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly OrderModel = this.prisma.commande;

  async createOrder(dto: CreateOrderDto) {
    try {
      return await this.OrderModel.create({
        data: dto,
        include: {
          article: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async closeOrder(id: string) {
    try {
      const order = await this.OrderModel.findUnique({
        where: { id },
      });
      if (!order) throw new ForbiddenException('Order could not be found');
      return this.OrderModel.update({
        data: { status: 'closed' },
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async cancelOrder(id: string) {
    try {
      const order = await this.OrderModel.findUnique({
        where: { id },
      });
      if (!order) throw new ForbiddenException('Order could not be found');
      return this.OrderModel.update({
        data: { status: 'canceled' },
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getOrders() {
    try {
      return this.OrderModel.findMany({
        where: {
          status: {
            not: 'closed',
          },
        },
        include: {
          article: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getHostoricClosed() {
    try {
      return this.OrderModel.findMany({
        where: {
          status: 'closed',
        },
        include: {
          article: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
