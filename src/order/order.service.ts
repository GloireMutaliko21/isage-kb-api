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
          article: {
            include: { unity: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async closeOrder(id: string) {
    try {
      const order = await this.OrderModel.findUnique({
        where: { id },
      });
      if (!order) throw new ForbiddenException('Order could not be found');
      return await this.OrderModel.update({
        data: { status: 'closed' },
        where: { id },
        include: {
          article: {
            include: { unity: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async cancelOrder(id: string) {
    try {
      const order = await this.OrderModel.findUnique({
        where: { id },
      });
      if (!order) throw new ForbiddenException('Order could not be found');
      return await this.OrderModel.update({
        data: { status: 'canceled' },
        where: { id },
        include: {
          article: {
            include: { unity: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getOrders() {
    try {
      return await this.OrderModel.findMany({
        where: {
          status: {
            not: 'closed',
          },
        },
        include: {
          article: {
            include: { unity: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getHostoricClosed() {
    try {
      return await this.OrderModel.findMany({
        where: {
          status: 'closed',
        },
        include: {
          article: {
            include: { unity: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }
}
