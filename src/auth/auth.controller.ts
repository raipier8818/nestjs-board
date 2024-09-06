import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './auth.guard';
import { User } from 'src/user/user.schema';

@Controller('auth')
export class AuthController {
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    req.session['user'] = req.user as User;
    req.session.save(() => {
      res.redirect('http://localhost:3000/post');
    });
  }

  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {}
}
