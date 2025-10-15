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
}

export default UserRepository;
