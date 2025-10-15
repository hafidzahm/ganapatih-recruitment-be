import { prisma } from '../utils/prisma.ts';
import type { RegisterSchemaType } from '../utils/schemas/user.schemas.ts';

class UserRepository {
  static async register(data: RegisterSchemaType) {
    return await prisma.users.create({
      data: {
        username: data.username,
        password_hash: data.password,
      },
    });
  }
}

export default UserRepository;
