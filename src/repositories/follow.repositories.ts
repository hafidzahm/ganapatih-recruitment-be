import { prisma } from '../utils/prisma.ts';

class FollowRepository {
  static async create(loginId: string, targetId: string) {
    return await prisma.follows.create({
      data: {
        follower_id: loginId,
        followee_id: targetId,
      },
    });
  }

  static async update(loginId: string, targetId: string) {
    const findFollow = await this.find(loginId, targetId);
    let state = '';
    console.log({ findFollow });

    if (findFollow > 0) {
      //unfollow
      await this.delete(loginId, targetId);
      state = 'Unfollow';
    } else {
      //follow
      await this.create(loginId, targetId);
      state = 'Follow';
    }

    console.log(state);
    return state;
  }

  static async find(loginId: string, targetId: string) {
    return await prisma.follows.count({
      where: {
        follower_id: loginId,
        followee_id: targetId,
      },
    });
  }

  static async findFollowByUserId(loginId: string, targetId: string) {
    return await prisma.follows.findUnique({
      where: {
        follower_id_followee_id: {
          follower_id: loginId,
          followee_id: targetId,
        },
      },
    });
  }

  static async delete(loginId: string, targetId: string) {
    return await prisma.follows.delete({
      where: {
        follower_id_followee_id: {
          followee_id: targetId,
          follower_id: loginId,
        },
      },
    });
  }
}

export default FollowRepository;
