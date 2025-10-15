import PostRepository from '../repositories/post.repositories.ts';
import type { PostSchemaType } from '../utils/schemas/post.schema.ts';

class PostService {
  static async createPost(data: PostSchemaType, userId: string) {
    const post = await PostRepository.create(data, userId);
    return post;
  }
}

export default PostService;
