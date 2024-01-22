import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthDto, LoginDto, RegisterDto } from '../dto';
import { CurrentUser, Public } from '../decorator';
import { AuthService } from 'src/services/auth.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOkResponse({ type: AuthDto })
  async register(@Body() dto: RegisterDto): Promise<AuthDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get()
  @ApiOkResponse({ type: AuthDto })
  getAuth(@CurrentUser() user: AuthDto): AuthDto {
    return user;
  }
}
