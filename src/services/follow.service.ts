import FollowRepository from '../repositories/follow.repositories.ts';

class FollowService {
  static async updateFollow(loginId: string, targetId: string) {
    const follow = await FollowRepository.update(loginId, targetId);
    return follow;
  }

  static async createFollow(loginId: string, targetId: string) {
    const follow = await FollowRepository.create(loginId, targetId);
    return follow;
  }

  static async deleteFollow(loginId: string, targetId: string) {
    const follow = await FollowRepository.delete(loginId, targetId);
    return follow;
  }

  static async findFollow(loginId: string, targetId: string) {
    const follow = await FollowRepository.find(loginId, targetId);
    return follow;
  }
}

export default FollowService;
