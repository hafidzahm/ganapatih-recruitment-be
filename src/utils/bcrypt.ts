import bcrypt from 'bcryptjs';

class BcryptService {
  static hashPassword(plainPassword: string): string {
    const hash = bcrypt.hashSync(plainPassword, 12);
    return hash;
  }

  static comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

export default BcryptService;
