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
      const targetUser = await UserService.findUserById(targetId);
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
  ) {
    try {
      const loginId = req?.user?.id as string;
      const targetId = req?.params?.userid as string;
      if (loginId === targetId) {
        throw {
          type: 'BadRequest',
          message: 'userId (actor) and userId (target) must different',
        };
      }
      const targetUser = await UserService.findUserById(targetId);
      if (!targetUser) {
        throw {
          type: 'NotFound',
          message: 'User not found',
        };
      }
      const findedFollowData = await FollowService.findFollow(
        loginId,
        targetId,
      );
      let message: string;

      //jika data follow tidak ditemukan
      console.log({ findedFollowData });

      if (!findedFollowData) {
        await FollowService.createFollow(loginId, targetId);
        message = `You are now following user ${targetId}`;
      } else {
        message = `You have following user ${targetId}`;
      }

      return res.status(200).json({
        message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteFollow(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const loginId = req?.user?.id as string;
    const targetId = req?.params?.userid as string;
    const findedFollowData = await FollowService.findFollow(loginId, targetId);
    if (loginId === targetId) {
      throw {
        type: 'BadRequest',
        message: 'userId (actor) and userId (target) must different',
      };
    }
    const targetUser = await UserService.findUserById(targetId);
    if (!targetUser) {
      throw {
        type: 'NotFound',
        message: 'User not found',
      };
    }
    let message: string;

    //jika data follow ditemukan
    console.log({ findedFollowData });

    if (findedFollowData) {
      await FollowService.deleteFollow(loginId, targetId);
      message = `You unfollowing user ${targetId}`;
    } else {
      message = `You have unfollowed user ${targetId}`;
    }

    return res.status(200).json({
      message,
    });
  }
}

export default FollowController;
