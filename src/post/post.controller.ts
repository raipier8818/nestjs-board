import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, PostQueryDto, PostResponseDto, UpdatePostDto, UpdatePostRequestDto } from './post.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
  ) {}

  @Get()
  async findPosts(@Query() postQueryDto: PostQueryDto): Promise<PostResponseDto[]> {
    return this.postService.findPosts(postQueryDto);
  }

  @Get('/:id')
  async findPostById(@Param('id') id: string): Promise<PostResponseDto> {    
    return this.postService.findPostById(id);
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<void> {
    return this.postService.createPost(createPostDto);
  }

  @Put('/:id')
  async updatePost(@Body() UpdatePostRequestDto: UpdatePostRequestDto, @Param() id: string): Promise<void> {
    const updatePostDto: UpdatePostDto = {
      id: id,
      ...UpdatePostRequestDto,
    }
    return this.postService.updatePost(updatePostDto);
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postService.deletePost(id);
  }
}
