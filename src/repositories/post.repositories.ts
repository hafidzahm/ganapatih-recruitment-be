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
}

export default PostRepository;
