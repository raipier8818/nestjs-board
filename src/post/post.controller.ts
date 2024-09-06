import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  CreatePostDto,
  CreatePostRequestDto,
  PostQueryDto,
  PostResponseDto,
  UpdatePostDto,
  UpdatePostRequestDto,
} from './post.dto';
import { LocalAuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { User } from 'src/user/user.schema';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findPosts(
    @Query() postQueryDto: PostQueryDto,
  ): Promise<PostResponseDto[]> {
    return this.postService.findPosts(postQueryDto);
  }

  @Get('/:id')
  async findPostById(@Param('id') id: string): Promise<PostResponseDto> {
    return this.postService.findPostById(id);
  }

  @Post()
  @UseGuards(LocalAuthGuard)
  async createPost(
    @Body() createPostRequestDto: CreatePostRequestDto,
    @Req() req: Request,
  ): Promise<PostResponseDto> {
    const user = req.session['user'] as User;
    const createPostDto: CreatePostDto = {
      ...createPostRequestDto,
      author: user.name,
    };
    return await this.postService.createPost(createPostDto);
  }

  @Put('/:id')
  @UseGuards(LocalAuthGuard)
  async updatePost(
    @Body() UpdatePostRequestDto: UpdatePostRequestDto,
    @Param() id: string,
    @Req() req: Request,
  ): Promise<void> {
    const updatePostDto: UpdatePostDto = {
      id: id,
      author: req.session['user'].name,
      ...UpdatePostRequestDto,
    };
    await this.postService.updatePost(updatePostDto);
  }

  @Delete('/:id')
  @UseGuards(LocalAuthGuard)
  async deletePost(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<void> {
    const author = req.session['user'].name;
    await this.postService.deletePost({ id, author });
  }
}
