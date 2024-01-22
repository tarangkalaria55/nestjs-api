import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'bson';
import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import { Payload } from 'src/config';
import { IS_PUBLIC_KEY } from 'src/decorator';
import { AuthDto } from 'src/dto';
import { NestjsConfigService } from 'src/nestjs-config/nestjs-config.service';
import { UserRepository } from 'src/repository';
import { User } from 'src/schema';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly config: NestjsConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = client.handshake?.headers?.authorization || '';
      //const token = this.extractTokenFromHeader(client.handshake?.headers?.authorization || '');
      if (!token) {
        throw new UnauthorizedException();
      }

      const payload = await this.jwtService.verifyAsync<Payload>(token, {
        secret: this.config.ACCESS_TOKEN_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const user = await this.validate(payload);
      context.switchToHttp().getRequest().user = user;
    } catch (err) {
      throw new WsException(err.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async validate(payload: Payload): Promise<AuthDto> {
    return new AuthDto(
      (await this.userRepository.findOne({
        _id: new ObjectId(payload.sub),
      } as FilterQuery<User>)) as any,
    );
  }
}
