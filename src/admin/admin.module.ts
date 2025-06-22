import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [AdminController],
  providers: [PrismaService, AdminService]
})
export class AdminModule {}
