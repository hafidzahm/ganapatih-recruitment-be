import BcryptService from '../utils/bcrypt.ts';
import { prisma } from '../utils/prisma.ts';
import type { RegisterSchemaType } from '../utils/schemas/user.schemas.ts';

class UserRepository {
  static async register(data: RegisterSchemaType) {
    const hashedPassword = BcryptService.hashPassword(data.password);
    return await prisma.users.create({
      data: {
        username: data.username,
        password_hash: hashedPassword,
        refresh_token: '',
      },
    });
  }

  static async updateRefresh(loginId: string, refreshToken?: string) {
    return await prisma.users.update({
      where: {
        id: loginId,
      },
      data: {
        refresh_token: refreshToken || '',
      },
    });
  }

  static async findByUsername(username: string) {
    return await prisma.users.findUnique({
      where: {
        username,
      },
    });
  }

  static async findById(id: string) {
    return await prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  static async getAll(
    take: number,
    skip: number,
    username?: string | undefined,
  ) {
    if (!username) {
      return await prisma.users.findMany({
        omit: {
          password_hash: true,
          created_at: true,
        },
        include: {
          following: true,
          followers: true,
        },
        take,
        skip,
      });
    } else {
      return await prisma.users.findMany({
        where: {
          username: {
            contains: username,
            mode: 'insensitive',
          },
        },
        omit: {
          password_hash: true,
          created_at: true,
        },
        include: {
          following: true,
          followers: true,
        },
        take,
        skip,
      });
    }
  }

  static async count(username?: string) {
    if (!username) {
      return await prisma.users.count();
    } else {
      return await prisma.users.count({
        where: {
          username: {
            contains: username,
            mode: 'insensitive',
          },
        },
      });
    }
  }
}

export default UserRepository;
