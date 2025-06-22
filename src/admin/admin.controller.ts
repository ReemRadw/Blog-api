import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from '@prisma/client';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Get('users')
  async getAllUsers(@Res() res: Response) {
    return this.adminService.getAllUsers(res);
  }
}
