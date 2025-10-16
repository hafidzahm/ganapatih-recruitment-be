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

  static async getFollowedPost(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      console.log({ query: req?.query });
      const loginId = req?.user?.id as string;
      const page = Number(req?.query?.page) || 1; // page ke berapa?
      const limit = Number(req?.query?.limit) || 5; // data per pagenya berapa?
      const take = limit; // ambil berapa data per page?

      const skip = (page - 1) * take; // mulai ambil data dari urutan ke?

      const totalPost = await PostService.getCountFollowedPost(loginId);

      const totalPage = Math.ceil(Number(totalPost) / limit); // total halaman = total data dibagi dataPerPage yang diambil

      const posts = await PostService.getFollowedPost(loginId, take, skip);
      const mappedPost = posts.map((post) => {
        return {
          id: post.id,
          userid: post.user_id,
          content: post.content,
          createdat: post.created_at as Date,
        };
      });
      return res.status(200).json({
        page: page,
        dataPerPage: limit,
        totalPage: totalPage,
        posts: mappedPost,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default PostController;
