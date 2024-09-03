import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, PostResponseDto, UpdatePostDto, UpdatePostRequestDto } from './post.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
  ) {}

  @Get()
  findAllPosts(): Promise<PostResponseDto[]> {
    return this.postService.findAllPosts();
  }

  @Get('/:id')
  findPostById(): Promise<PostResponseDto> {
    return this.postService.findPostById('id');
  }

  @Get('/:author')
  findPostsByAuthor(): Promise<PostResponseDto[]> {
    return this.postService.findPostsByAuthor('author');
  }

  @Get('/:title')
  findPostsByTitle(): Promise<PostResponseDto[]> {
    return this.postService.findPostsByTitle('title');
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto): Promise<void> {
    return this.postService.createPost(createPostDto);
  }

  @Put('/:id')
  updatePost(@Body() UpdatePostRequestDto: UpdatePostRequestDto): Promise<void> {
    const updatePostDto: UpdatePostDto = {
      _id: 'id',
      ...UpdatePostRequestDto,
    }
    return this.postService.updatePost(updatePostDto);
  }

  @Delete('/:id')
  deletePost(): Promise<void> {
    return this.postService.deletePost('id');
  }
}
