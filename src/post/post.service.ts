import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto, PostResponseDto, UpdatePostDto, PostQueryDto, DeletePostDto } from './post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async findPostById(id: string): Promise<PostResponseDto> {
    let _id: Types.ObjectId;
    let result: PostDocument;
    
    try{
      _id = new Types.ObjectId(id);
    }catch (err){
      throw new BadRequestException(`Invalid id ${id}`);
    }
    
    result = await this.postModel.findById(_id).exec();
    if (!result) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return new PostResponseDto(result);
  }

  async findPosts(postQueryDto: PostQueryDto): Promise<PostResponseDto[]> {
    const result = await this.postModel.find({...postQueryDto}).exec();
    return result.map((post) => new PostResponseDto(post));
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const post = new this.postModel(createPostDto);
    return await post.save() as PostResponseDto;
  }

  async updatePost(updatePostDto: UpdatePostDto): Promise<void> {
    const { id, author, ...rest } = updatePostDto;
    const update = {
      ...rest,
      updatedAt: new Date().toISOString(),
    }

    const result = await this.postModel.updateOne({ _id: new Types.ObjectId(id), author }, update).exec();
    if (result.modifiedCount === 0) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return;
  }

  async deletePost(deletePostDto: DeletePostDto): Promise<void> {
    const result = await this.postModel.deleteOne({ _id: new Types.ObjectId(deletePostDto.id), author: deletePostDto.author }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Post with id ${deletePostDto.id} not found`);
    }

    return;
  }  
}
