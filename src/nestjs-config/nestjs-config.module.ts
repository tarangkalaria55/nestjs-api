import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestjsConfigService } from './nestjs-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [NestjsConfigService],
  exports: [NestjsConfigService],
})
export class NestjsConfigModule {}
