import UserRepository from '../repositories/user.repositories.ts';
import { type RegisterSchemaType } from '../utils/schemas/user.schemas.ts';

class UserService {
  static async registerUser(data: RegisterSchemaType) {
    const user = await UserRepository.register(data);
    return user;
  }

  static async findUserByUsername(username: string) {
    const user = await UserRepository.findByUsername(username);
    return user;
  }

  static async findUserById(id: string) {
    const user = await UserRepository.findById(id);
    return user;
  }

  static async getAllUser() {
    const user = await UserRepository.getAll();
    return user;
  }
}

export default UserService;
