import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './post.schema';
import { CreatePostDto } from './post.dto';
import { LocalAuthGuard } from '../auth/auth.guard';

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

describe.each([posts])('PostController', (post: CreatePostDto) => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useFactory: () => ({}),
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true),
      })
      .compile();

    controller = app.get<PostController>(PostController);
    service = app.get<PostService>(PostService);
  });

  it('create a post', async () => {
    jest.spyOn(service, 'createPost').mockResolvedValue();

    const result = await controller.createPost(post);
    expect(service.createPost).toHaveBeenCalled();
  });

  it('get all posts', async () => {
    jest.spyOn(service, 'findPosts').mockResolvedValue([
      {
        id: "post id",
        title: post.title,
        content: post.content,
        author: post.author,
        createdAt: new Date().toISOString(),
      }
    ]);

    const result = await controller.findPosts({});
    expect(service.findPosts).toHaveBeenCalled();
  });
});