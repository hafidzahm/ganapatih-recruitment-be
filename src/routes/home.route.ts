import { Router, type Request, type Response } from 'express';

const homeRoute = Router();

homeRoute.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'Ganapatih Recruitment API is LIVE!',
  });
});

export default homeRoute;
