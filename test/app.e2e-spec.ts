import { CreatePostRequestDto } from './../src/post/post.dto';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { CreatePostDto, PostResponseDto } from '../src/post/post.dto';
import { LocalAuthGuard } from '../src/auth/auth.guard';
import { ConfigType } from '@nestjs/config';
import appConfig from '../src/config/app.config';
import * as session from 'express-session';

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

describe.only.each([Array.from({ length: 100 }, createRandomPostDto)])(
  'PostController e2e with single data (without google oauth)',
  (createPostDto: CreatePostDto) => {
    let app: INestApplication;
    let post: PostResponseDto;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideGuard(LocalAuthGuard)
        .useValue({
          canActivate: (context: ExecutionContext) => {
            const request = context.switchToHttp().getRequest();
            request.session.user = {
              name: createPostDto.author,
            };

            return true;
          },
        })
        .compile();

      app = moduleFixture.createNestApplication();
      const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
      app.use(
        session({
          secret: config.session.secret,
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false,
            maxAge: config.session.maxAge,
          },
        }),
      );
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    test('/post (GET) - find all posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/post')
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toEqual(0);
    });

    test('/post (POST) - create post', async () => {
      const createPostRequestDto: CreatePostRequestDto = {
        title: createPostDto.title,
        content: createPostDto.content,
      };

      const response = await request(app.getHttpServer())
        .post('/post')
        .send(createPostRequestDto);

      expect(response.body).toEqual(expect.objectContaining(createPostDto));
    });

    test('/post (GET) - find all posts after create', async () => {
      const response = await request(app.getHttpServer())
        .get('/post')
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      post = response.body[0];
      expect(post).toEqual(expect.objectContaining(createPostDto));
    });

    test('/post/:id (GET) - find post by id after create', async () => {
      const response = await request(app.getHttpServer())
        .get(`/post/${post.id}`)
        .expect(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(post);
    });

    test('/post?title= (GET) - find post by title after create', async () => {
      const response = await request(app.getHttpServer())
        .get(`/post?title=${post.title}`)
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toEqual(1);
      expect(response.body[0]).toEqual(post);
    });

    test('/post?author= (GET) - find post by author after create', async () => {
      const response = await request(app.getHttpServer())
        .get(`/post?author=${post.author}`)
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toEqual(1);
      expect(response.body[0]).toEqual(post);
    });

    test('/post/:id (PUT) - update post', async () => {
      const updatedPost = createRandomPostDto();
      delete updatedPost.author;

      createPostDto.title = updatedPost.title;
      createPostDto.content = updatedPost.content;

      await request(app.getHttpServer())
        .put(`/post/${post.id}`)
        .send(updatedPost)
        .expect(200);
    });

    test('/post (GET) - find all posts after update', async () => {
      const response = await request(app.getHttpServer())
        .get('/post')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      post = response.body[0];
      expect(post).toEqual(expect.objectContaining(createPostDto));
    });

    test('/post/:id (GET) - find post by id after update', async () => {
      const response = await request(app.getHttpServer())
        .get(`/post/${post.id}`)
        .expect(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(post);
    });

    test('/post?title= (GET) - find post by title after update', async () => {
      const response = await request(app.getHttpServer())
        .get(`/post?title=${post.title}`)
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toEqual(1);
      expect(response.body[0]).toEqual(post);
    });

    test('/post?author= (GET) - find post by author update', async () => {
      const response = await request(app.getHttpServer())
        .get(`/post?author=${post.author}`)
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toEqual(1);
      expect(response.body[0]).toEqual(post);
    });

    test('/post/:id (DELETE) - delete post', async () => {
      await request(app.getHttpServer()).delete(`/post/${post.id}`).expect(200);
    });

    test('/post (GET) - find all posts after delete', async () => {
      const response = await request(app.getHttpServer())
        .get('/post')
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toEqual(0);
    });

    test('/post/:id (GET) - find post by id after delete', async () => {
      await request(app.getHttpServer()).get(`/post/${post.id}`).expect(404);
    });

    test('/post?title= (GET) - find post by title after delete', async () => {
      await request(app.getHttpServer())
        .get(`/post?title=${post.title}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toEqual(0);
        });
    });

    test('/post?author= (GET) - find post by author after delete', async () => {
      await request(app.getHttpServer())
        .get(`/post?author=${post.author}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toEqual(0);
        });
    });
  },
);
