import type { NextFunction, Response } from 'express';
import type { CustomRequest } from '../types/customRequest.ts';

class PostController {
  static getUser(req: CustomRequest, res: Response, next: NextFunction) {
    return res.status(200).json({
      user: req?.user || '',
    });
  }
}
export default PostController;
