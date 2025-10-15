import type { NextFunction, Response } from 'express';
import type { CustomRequest } from '../types/customRequest.ts';
import { postSchema } from '../utils/schemas/post.schema.ts';
import PostService from '../services/post.services.ts';

class PostController {
  static getUser(req: CustomRequest, res: Response, next: NextFunction) {
    return res.status(200).json({
      user: req?.user || '',
    });
  }

  static async createPost(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      //cek validasi input
      const validatedData = postSchema.safeParse(req.body);
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

      const userLoginId = req.user?.id as string;
      const post = await PostService.createPost(
        validatedData.data,
        userLoginId,
      );
      return res.status(201).json({
        id: post.id,
        userid: post.user_id,
        content: post.content,
        createdat: post.created_at,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default PostController;
