import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string | number) {
    const userIdNumber = Number(userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userIdNumber },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async updateProfile(
    userId: string | number,
    data: { name?: string; address?: string },
  ) {
    const userIdNumber = Number(userId);
    return this.prisma.user.update({
      where: { id: userIdNumber },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
      },
    });
  }

  // Admin methods
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async updateUserById(id: number, data: { name?: string; address?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, address: true },
    });
  }

  async deleteUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User berhasil dihapus' };
  }
}
