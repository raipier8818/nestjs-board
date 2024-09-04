import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './post.schema';
import { CreatePostDto } from './post.dto';

const createRandomString = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const createRandomPost = (): CreatePostDto => {
  return {
    title: createRandomString(10),
    content: createRandomString(100),
    author: createRandomString(10),
  }
}


describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  const post_len = 1000;
  let posts: Post[] = [];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ 
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useFactory: () => {}
        }
      ],
    }).compile();

    service = moduleRef.get<PostService>(PostService);
    controller = moduleRef.get<PostController>(PostController);
  });

  it('findPosts should return an empty array of PostResponseDto', async () => {
    jest.spyOn(service, 'findPosts').mockResolvedValue(Promise.resolve([]));

    const result = await controller.findPosts({});
    expect(result).toEqual([]);
  });

  it('createPost should return void', async () => {
    jest.spyOn(service, 'createPost').mockResolvedValue(Promise.resolve());

    for (let i = 0; i < post_len; i++) {
      const post = createRandomPost();
      await controller.createPost(post);
    }

    expect(service.createPost).toBeCalledTimes(post_len);
  });

  it('find all posts should return an array of PostResponseDto', async () => {
    
  });
});
