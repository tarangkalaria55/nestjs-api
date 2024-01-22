import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from 'src/config';

@Injectable()
export class NestjsConfigService {
  constructor(private readonly config: ConfigService) {}

  get MONGO_URI() {
    return this.config.get<string>('MONGO_URI');
  }
  get ACCESS_TOKEN_SECRET() {
    return this.config.get<string>('ACCESS_TOKEN_SECRET');
  }
  get ACCESS_TOKEN_EXPIRES_IN() {
    return this.config.get<string>('ACCESS_TOKEN_EXPIRES_IN');
  }

  get accessTokenConfig(): JwtConfig {
    return {
      secret: this.ACCESS_TOKEN_SECRET,
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    };
  }
}
