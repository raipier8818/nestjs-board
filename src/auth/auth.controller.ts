import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { Request as Req, Response as Res } from 'express';
import { GoogleAuthGuard } from './auth.guard';
import { User } from 'src/user/user.schema';

@Controller('auth')
export class AuthController {
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}


  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req: Req, @Response() res: Res) {
    req.session['user'] = req.user as User;
    req.session.save((err) => {
      if(err){
        console.log(err);
        return res.status(500).send('Internal Server Error');
      }      
      
      return res.redirect('http://localhost:3000/post');
    });
  }
}
