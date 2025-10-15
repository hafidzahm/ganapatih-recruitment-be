import FollowRepository from '../repositories/follow.repositories.ts';

class FollowService {
  static async updateFollow(loginId: string, targetId: string) {
    const follow = await FollowRepository.update(loginId, targetId);
    return follow;
  }
}

export default FollowService;
