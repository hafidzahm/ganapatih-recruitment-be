import jwt from 'jsonwebtoken';
class JwtService {
  static sign(data: {}) {
    const SECRET = process.env.JWT_SECRET;
    return jwt.sign(data, SECRET as string);
  }

  static verify(token: string) {
    const SECRET = process.env.JWT_SECRET;
    return jwt.verify(token, SECRET as string);
  }
}

export default JwtService;
