import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';

@Injectable()
export class PostService {
  constructor() {}

  findPostById(id: string): Promise<PostResponseDto> {
    
  }

  findAllPosts(): Promise<PostResponseDto[]> {

  }

  findPostsByAuthor(author: string): Promise<PostResponseDto[]> {

  }

  findPostsByTitle(title: string): Promise<PostResponseDto[]> {

  }

  createPost(createPostDto: CreatePostDto): Promise<void> {

  }

  updatePost(updatePostDto: UpdatePostDto): Promise<void> {

  }

  deletePost(id: string): Promise<void> {

  }  
}
