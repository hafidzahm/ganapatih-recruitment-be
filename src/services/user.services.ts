import UserRepository from '../repositories/user.repositories.ts';
import {
  registerSchema,
  type RegisterSchemaType,
} from '../utils/schemas/user.schemas.ts';

class UserService {
  static async registerUser(data: RegisterSchemaType) {
    //validasi input dulu
    const validatedData = registerSchema.safeParse(data);
    if (validatedData.error) {
      const errorMessage = validatedData.error.issues.map((err) => {
        return err.message;
      });

      const detailError = errorMessage[0];

      throw {
        type: 'ZodValidationError',
        message: 'Validation error',
        details: detailError,
      };
    }

    //gas masukin datanya
    const user = await UserRepository.register(validatedData.data);
    return user;
  }

  static async findUserByUsername(username: string) {
    const user = await UserRepository.findByUsername(username);
    return user;
  }
}

export default UserService;
