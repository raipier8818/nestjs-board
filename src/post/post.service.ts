import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, PostResponseDto, UpdatePostDto } from './post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async findPostById(id: string): Promise<PostResponseDto> {
    const result = await this.postModel.findById(new Types.ObjectId(id)).exec();
    if (!result) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return new PostResponseDto(result);
  }

  async findAllPosts(): Promise<PostResponseDto[]> {
    const result = await this.postModel.find().exec();
    return result.map((post) => new PostResponseDto(post));
  }

  async findPostsByAuthor(author: string): Promise<PostResponseDto[]> {
    const result = await this.postModel.find({ author }).exec();
    return result.map((post) => new PostResponseDto(post));
  }

  async findPostsByTitle(title: string): Promise<PostResponseDto[]> {
    const result = await this.postModel.find({ title }).exec();
    return result.map((post) => new PostResponseDto(post));
  }

  async createPost(createPostDto: CreatePostDto): Promise<void> {
    const post = new this.postModel(createPostDto);
    await post.save();
  }

  async updatePost(updatePostDto: UpdatePostDto): Promise<void> {
    const { _id, ...rest } = updatePostDto;
    await this.postModel.updateOne({ _id: new Types.ObjectId(_id) }, rest).exec();
  }

  async deletePost(id: string): Promise<void> {
    await this.postModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
  }  
}
