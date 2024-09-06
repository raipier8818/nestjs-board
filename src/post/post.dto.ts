import { IsEmpty, IsNotEmpty, IsNotIn, IsOptional, IsString } from "class-validator";
import { PostDocument } from "./post.schema";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsEmpty()
  author?: string;
}

export class UpdatePostRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdatePostDto extends UpdatePostRequestDto {
  id: string;
  author: string;
}

export class PostResponseDto extends CreatePostDto {
  id: string;
  createdAt: string;
  updatedAt?: string;

  constructor(post: PostDocument) {
    super();
    this.id = post._id.toString();
    this.title = post.title;
    this.content = post.content;
    this.author = post.author;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}

export class PostQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;
}

export class DeletePostDto {
  id: string;
  author: string;
}