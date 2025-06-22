import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ResponseService } from 'src/services/response.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService,private jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto, res: Response) {
        try {
          const { userName, password, role } = dto;
    
          const existingUser = await this.prisma.user.findUnique({
            where: { userName },
          });
    
          if (existingUser) {
            return ResponseService.conflict(res, 'Username already exists');
          }
    
          const hashedPassword = await bcrypt.hash(password, 8);
    
          const newUser = await this.prisma.user.create({
            data: {
              userName,
              password: hashedPassword,
              role: role 
            },
          });
    
          const { password: _, ...userWithoutPassword } = newUser;
    
          return ResponseService.created(
            res,
            'User registered successfully',
            userWithoutPassword,
          );
        } catch (error) {
          console.error('Register error:', error);
          return ResponseService.internalServerError(res);
        }
      }

      async login(dto: LoginDto, res: Response) {
        try {
          const { userName, password } = dto;
    
          const user = await this.prisma.user.findUnique({
            where: { userName },
          });
          
          if (!user) {
            return ResponseService.badRequest(res, 'Bad Credentials', 'Invalid username or password');
          }
          
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return ResponseService.badRequest(res, 'Bad Credentials', 'Invalid username or password');
          }
    
          const payload = {
            sub :user.id,
            role: user.role,
          };
    
          const token = await this.jwtService.signAsync(payload);
    
          return ResponseService.success(res, 'Login successful', {
            user: {
              id: user.id,
              userName: user.userName,
              role: user.role,
            },
            token,
          });
        } catch (error) {
          console.error('Login error:', error);
          return ResponseService.internalServerError(res);
        }
      }
}
