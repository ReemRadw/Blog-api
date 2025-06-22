import { Body, Controller, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body(ValidationPipe)
    registerDto: RegisterDto,
    @Res() res: Response,
  ) {
    return this.authService.register(registerDto, res);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    return this.authService.login(dto, res);
  }
}
