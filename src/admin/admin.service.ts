import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/services/prisma.service';
import { ResponseService } from 'src/services/response.service';

@Injectable()
export class AdminService {

    constructor(private readonly prisma: PrismaService) {}


    async getAllUsers(res: Response) {
        try {
          const users = await this.prisma.user.findMany({
            where: {
              role: 'USER', 
            },
            select: {
              id: true,
              userName: true,
              role: true,
            },
          });
      
          return ResponseService.success(res, 'Users retrieved successfully', users);
        } catch (error) {
          console.error('Get all users error:', error);
          return ResponseService.internalServerError(res);
        }
      }
      
}
