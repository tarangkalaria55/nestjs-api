import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AuthDto } from '../dto/auth.dto';
import { User, UserDocument } from '../schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<AuthDto> {
    try {
      const newUser = new this.userModel(user);
      return new AuthDto((await newUser.save()).toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('This email id is already in use');
      }

      throw error;
    }
  }

  async findOne(refreshTokenFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(
      refreshTokenFilterQuery,
      {},
      {
        lean: true,
      },
    );
  }
}
