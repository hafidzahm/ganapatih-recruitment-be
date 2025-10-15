import type { NextFunction, Response } from 'express';
import type { CustomRequest } from '../types/customRequest.ts';
import FollowService from '../services/follow.service.ts';
import UserService from '../services/user.services.ts';

class FollowController {
  static async updateFollow(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      //cek id target dan id login jgn sama
      const loginId = req?.user?.id as string;
      const targetId = req?.params?.userid as string;

      if (loginId === targetId) {
        throw {
          type: 'BadRequest',
          message: 'userId (actor) and userId (target) must different',
        };
      }
      const targetUser = UserService.findUserById(targetId);
      if (!targetUser) {
        throw {
          type: 'NotFound',
          message: 'User not found',
        };
      }

      const state = await FollowService.updateFollow(loginId, targetId);
      return res.status(200).json({
        message: `You are ${state === 'Follow' ? 'now following user' : 'unfollowed user'} ${targetId}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createFollow(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {}

  static async deleteFollow(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {}
}

export default FollowController;
