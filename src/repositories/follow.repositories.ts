import { prisma } from '../utils/prisma.ts';

class FollowRepository {
  static async create(loginId: string, targetId: string) {
    return await prisma.follows.create({
      data: {
        followee_id: targetId,
        follower_id: loginId,
      },
    });
  }
}

export default FollowRepository;
