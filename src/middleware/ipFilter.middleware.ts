import { NextFunction, Request, Response } from "express";

const whitelist = [
  'http://localhost:8000',
];

export class IpFilterMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'test') {
      next();
      return;
    }

    if (!whitelist.includes(req.headers.origin)) {
      req.session['user'] = {
        name: 'fastapi'
      };

      return req.session.save(() => {
        next();
      });
    }

    next();
  }
}