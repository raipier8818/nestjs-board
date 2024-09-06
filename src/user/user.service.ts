import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const user = new this.userModel(createUserDto);
    await user.save();
  }

  async deleteUserByEmail(email: string): Promise<void> {
    await this.userModel.deleteOne({ email }).exec();
  }

  async updateUserByEmail(updateUserDto: UpdateUserDto): Promise<void> {
    const { email, ...rest } = updateUserDto;
    await this.userModel.updateOne({ email }, rest).exec();
  }
}
