import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [PostController],
  providers: [PrismaService,PostService]
})
export class PostModule {}
