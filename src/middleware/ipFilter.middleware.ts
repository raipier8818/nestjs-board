import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class IpFilterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'test') {
      next();
      return;
    }

    next();
  }
}
