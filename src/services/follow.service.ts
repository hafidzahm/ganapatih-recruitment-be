import FollowRepository from '../repositories/follow.repositories.ts';

class FollowService {
  static async createFollow(loginId: string, targetId: string) {
    const follow = await FollowRepository.create(loginId, targetId);
    return follow;
  }
}

export default FollowService;
