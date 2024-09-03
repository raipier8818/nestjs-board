import { PostDocument } from "./post.schema";

export class CreatePostDto {
  title: string;
  content: string;
  author: string;
  createdAt: string;  
  updatedAt: string;
}

export class UpdatePostRequestDto {
  title: string;
  content: string;
  updatedAt: string;
}

export class UpdatePostDto extends UpdatePostRequestDto {
  _id: string;
}

export class PostResponseDto extends CreatePostDto {
  _id: string;

  constructor(post: PostDocument) {
    super();
    this._id = post._id.toString();
    this.title = post.title;
    this.content = post.content;
    this.author = post.author;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}