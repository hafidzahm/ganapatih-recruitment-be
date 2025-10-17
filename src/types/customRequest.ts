import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
  id: string;
  username: string;
  refresh_token: string;
}

export interface CustomRequest extends Request {
  user?: UserPayload;
}
