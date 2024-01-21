import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repository';
import { LoginDto, RegisterDto } from '../dto';
import { ObjectId } from 'bson';
import { JwtConfig, Payload, accessTokenConfig } from 'src/config';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthDto> {
    return await this.userRepository.create({
      _id: new ObjectId(),
      ...dto,
    });
  }

  async login(dto: LoginDto): Promise<{
    access_token: string;
  }> {
    const user = await this.userRepository.findOne({
      email: dto.email,
    });

    if (!user) throw new NotFoundException('User not found');

    const checkPassword = user.password == dto.password;

    if (!checkPassword) throw new UnauthorizedException('Invalid password');

    const payload: Payload = {
      sub: user._id,
      email: user.email,
    };

    const accessToken = this.generateJWT(payload, accessTokenConfig());

    return {
      access_token: accessToken,
    };
  }

  generateJWT(payload: Payload, config: JwtConfig) {
    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }
}
