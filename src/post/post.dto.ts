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
}