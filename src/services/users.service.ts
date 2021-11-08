import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import { CreateUserDto, GetUserDto, UpdateUserDto } from '@dtos/user.dto';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async getAll(): Promise<GetUserDto[]> {
    return this.userModel.find();
  }

  async updateById(userId: string, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, { returnDocument: 'after' });
  }

  async deleteById(userId: string): Promise<GetUserDto> {
    return this.userModel.findByIdAndDelete(userId);
  }
}
