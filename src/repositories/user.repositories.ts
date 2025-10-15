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

  static async getAll() {
    return await prisma.users.findMany();
  }
}

export default UserRepository;
