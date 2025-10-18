import jwt from 'jsonwebtoken';
class JwtService {
  static signAccess(data: {}) {
    const SECRET = process.env.JWT_SECRET;
    console.log('1m expires');

    return jwt.sign(data, SECRET as string, {
      expiresIn: '1d',
    });
  }
  static signRefresh(data: {}) {
    const SECRET = process.env.JWT_SECRET;
    console.log('7d expires');

    return jwt.sign(data, SECRET as string, {
      expiresIn: '7d',
    });
  }

  static verifyAccess(token: string) {
    const SECRET = process.env.JWT_SECRET;

    return jwt.verify(token, SECRET as string);
  }

  static verifyRefresh(token: string) {
    const SECRET = process.env.JWT_SECRET;

    return jwt.verify(token, SECRET as string);
  }
}

export default JwtService;
