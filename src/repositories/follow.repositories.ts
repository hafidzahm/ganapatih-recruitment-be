import { prisma } from '../utils/prisma.ts';

class FollowRepository {
  static async create(loginId: string, targetId: string) {
    return await prisma.follows.create({
      data: {
        follower_id: targetId,
        followee_id: loginId,
      },
    });
  }

  static async update(loginId: string, targetId: string) {
    const findFollow = await this.find(loginId, targetId);
    let state = '';
    console.log({ findFollow });

    if (findFollow) {
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
    return await prisma.follows.findFirst({
      where: {
        follower_id: targetId,
        followee_id: loginId,
      },
    });
  }

  static async findFollowByUserId(loginId: string, targetId: string) {
    return await prisma.follows.findUnique({
      where: {
        follower_id_followee_id: {
          follower_id: targetId,
          followee_id: loginId,
        },
      },
    });
  }

  static async delete(loginId: string, targetId: string) {
    return await prisma.follows.delete({
      where: {
        follower_id_followee_id: {
          followee_id: loginId,
          follower_id: targetId,
        },
      },
    });
  }
}

export default FollowRepository;
