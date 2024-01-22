import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repository';
import { ChatGateway } from './gateways/chat.gateway';
import { NestjsConfigModule } from './nestjs-config/nestjs-config.module';
import { NestjsConfigService } from './nestjs-config/nestjs-config.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard';

@Module({
  imports: [
    NestjsConfigModule,
    MongooseModule.forRootAsync({
      imports: [NestjsConfigModule],
      inject: [NestjsConfigService],
      useFactory: async (config: NestjsConfigService) => ({
        uri: config.MONGO_URI,
      }),
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [NestjsConfigModule],
      inject: [NestjsConfigService],
      useFactory: async (config: NestjsConfigService) =>
        ({
          global: true,
          secret: config.ACCESS_TOKEN_SECRET,
          signOptions: {
            expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
          },
        }) as JwtModuleOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    UserRepository,
    ChatGateway,
  ],
})
export class AppModule {}
