import { prisma } from '../utils/prisma.ts';
import type { PostSchemaType } from '../utils/schemas/post.schema.ts';

class PostRepository {
  static async create(data: PostSchemaType, userId: string) {
    return await prisma.posts.create({
      data: {
        user_id: userId,
        content: data.content,
      },
    });
  }

  static async getFollowed(loginId: string) {
    return await prisma.posts.findMany({
      where: {
        user: {
          following: {
            some: {
              follower_id: loginId,
            },
          },
        },
      },
    });
  }

  static async totalGetFollowed(loginId: string) {
    return await prisma.posts.count({
      where: {
        user: {
          following: {
            some: {
              follower_id: loginId,
            },
          },
        },
      },
    });
  }
}

export default PostRepository;
