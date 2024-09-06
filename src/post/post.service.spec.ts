import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from '@nestjs/common';
import { CreatePostDto } from './post.dto';

const createRandomString = (length: number): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createRandomPostDto = (): CreatePostDto => {
  return {
    title: createRandomString(10),
    content: createRandomString(100),
    author: createRandomString(10),
  };
};

const posts = Array.from({ length: 10 }, createRandomPostDto);

describe.each([posts])('PostService', (post: CreatePostDto) => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useFactory: () => ({}),
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it.todo('find all posts');
  it.todo('create a post');
  it.todo('find a post by id');
  it.todo('update a post');
  it.todo('find a post by id');
  it.todo('delete a post');
  it.todo('find all posts');
});
